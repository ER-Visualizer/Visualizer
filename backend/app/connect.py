import asyncio
import websockets
from random import randint, random
from flask import Flask
import json
import time
from .models.node import Node

app = Flask(__name__)


class WebsocketServer:
    """
    Websocket to send events to the frontend
    """
    def __init__(self, host, port, producerFunc, process, statistics, packet_rate,
                canvas):
        self.host = host
        self.port = port
        # function to get events
        self.producerFunc = producerFunc
        # event loop
        self.server = None
        # websocket server
        self.wserver = None
        # function to process event_heap (process_heap)
        self.process = process
        # function to get statistics
        self.stats = statistics
        # check whether stats have been sent
        self.sent_stats = False
        # the frequency of sending events
        self.packet_rate = packet_rate

        self.canvas = canvas[:]

    def start(self) -> None:
        """
        Starts new websocket thread that runs forever
        """
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        self.wserver = websockets.serve(self.__producer_handler, port=self.port, loop=loop)
        try:
            # run server forever
            self.server = asyncio.get_event_loop()
            self.server.run_until_complete(self.wserver)
            self.server.run_forever()
        except Exception:
            self.close()

        loop.run_forever()

    async def _internalStop(self):
        """
        Close the websocket event loop and server
        """
        self.wserver.close()
        await self.wserver.wait_closed()
        self.server.stop()
        while (self.server.is_running()):
            time.sleep(0.5)
        self.server.close()
        self.server = None

    def close(self):
        """
        Close websocket
        """
        app.logger.info("closing sockets")
        self._internalStop()

    async def get_formatted_stats(self, stats) -> dict:
        """
        Reformats stats into a csv parseable format
        :param stats: Dictionary of statistics
        """
        # get all patients
        all_patients = [key for key in stats['patients']['process']]

        # get all processes in sorted order
        processes = self.nodes_in_bfs_order()
        patient_headers = ["Patient ID"]
        app.logger.info(stats)
        # set up patient.csv headers
        for process in processes:
            patient_headers.append(process + "_process_time")
            patient_headers.append(process + "_wait_time")
        patient_csv = [patient_headers]
        for patient in all_patients:
            res = [patient]
            for process in processes:
                # for each patient add the process time and wait time for each process
                if patient in stats['patients']['process'] and process in stats['patients']['process'][patient]:
                    process_time = stats['patients']['process'][patient][process]
                else:
                    # patient did not visit this process
                    process_time = "None"
                if patient in stats['patients']['wait'] and process in stats['patients']['wait'][patient]:
                    wait_time = stats['patients']['wait'][patient][process]
                else:
                    # patient did not wait in this process
                    wait_time = "None"
                res.append(process_time)
                res.append(wait_time)
            patient_csv.append(res)
        # get all doctors
        all_doctors = [key for key in stats['doctors']['seen']]
        doctor_headers = ["Doctor ID", "seen"]
        for patient in all_patients:
            doctor_headers.append(patient)
        doctor_csv = [doctor_headers]
        for doctor in all_doctors:
            res = [doctor, stats['doctors']['seen'][doctor]]
            # for each doctor get the time spent with each patient
            for patient in all_patients:
                if patient in stats['doctors']['length'][doctor]:
                    res.append(str(stats['doctors']['length'][doctor][patient]))
                else:
                    res.append("None")
            doctor_csv.append(res)

        hospital_headers = [key for key in stats['hospital']]
        hosptial_csv = [hospital_headers]
        hospital_data = []
        for k, value in stats["hospital"].items():
            hospital_data.append(value)

        hosptial_csv.append(hospital_data)
        util_headers = []
        util_body = []
        # format resource utilization
        for resource in processes:
            if resource in stats["util"]:
                util_headers.append(resource)
                util_body.append(stats["util"][resource])
        util_csv = [util_headers, util_body]

        formatted_stats = {"stats": stats["stats"], "hospital": hosptial_csv, "doctors": doctor_csv, "patients": patient_csv, "util": util_csv}
        return formatted_stats

    async def __producer_handler(self, websocket, path):
        while True:
            # checks whether simulation is over
            check = self.process()
            # get the latest events
            message = self.producerFunc()
            # if simulation is over and stats have not been sent
            if not check and not self.sent_stats:
                # send stats and close socket
                stats = self.stats()
                formatted_stats = await self.get_formatted_stats(stats)
                message = json.dumps(formatted_stats)
                self.sent_stats = True
                await websocket.send(message)
                self.close()
                break
            elif not check or message == []:
                message = '{"Event": {}}'
            else:
                self.sent_stats = False
            try:
                # send events
                await websocket.send(message)
                await asyncio.sleep(self.packet_rate * 0.1)
            except (websockets.exceptions.ConnectionClosed, websockets.exceptions.ConnectionClosedOK):
                self.close()
                break

    def nodes_in_bfs_order(self):
        app.logger.info("Creating a BFS order")
        nodes_list = {}
        bfs_list = []
        
        # create the dictionary
        for node in self.canvas:
            # create node
            nodes_list[node["id"]] = Node(node["id"], node["queueType"], node["priorityFunction"], node["numberOfActors"],
                                            process_name=node["elementType"], distribution_name=node["distribution"],
                                            distribution_parameters=node["distributionParameters"], output_process_ids=node["children"], rules=[],
                                            priority_type=node["priorityType"])
        # Do a BFS
        # open_list is the list to be explored. Append to it the ids to explore,
        # from the first node, which will be the reception(id:0).
        open_list = nodes_list[0].get_output_process_ids()
        # append the 0th id, reception
        bfs_list.append(0)
        app.logger.info("open_list is {}".format(open_list))
        while len(open_list) != 0:
            node_id = open_list.pop(0)
            # don't append an id to visited, if it's already been visited
            if node_id not in bfs_list:
                # append the node_id in the bfs list that you just explored
                bfs_list.append(node_id)
            # append the children in the open_list to be explored
            children_to_explore = nodes_list[node_id].get_output_process_ids()
            # don't append to visit a child if we visited it before
            for child_id in children_to_explore:
                if child_id not in bfs_list:
                    open_list.append(child_id)
        # if there is a bug, i.e not all  of the node_ids have been added,
        # log a warning, and just send an unordered one
        if len(set(bfs_list)) != len(nodes_list):
            app.logger.warn("Not all ids are stored in bfs_list: {}.\
                Sending unordered list of nodes instead".format(bfs_list))
            bfs_list = list(nodes_list.keys())
        app.logger.info("Nodes in order are {}".format(bfs_list))
        resource_name = []
        for n_id in bfs_list:
            resource_name.append(nodes_list[n_id].get_process_name())
        return resource_name

def producePatientData():
    time.sleep(random() * 2)
    jsonToSend = [{"patientId": 1, "from": randint(1, 10), "to": randint(1, 10)},
        {"patientId": 2, "from": randint(1, 10), "to": randint(1, 10)},
        {"patientId": 3, "from": randint(1, 10), "to": randint(1, 10)}]
    return json.dumps(jsonToSend)


