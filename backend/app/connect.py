import asyncio
import websockets
from random import randint, random
from flask import Flask
import json
import time

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
        # the canvas 
        self.canvas = canvas

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

    async def get_formatted_stats(self, stats)->dict:
        """
        Reformats stats into a csv parseable format
        :param stats: Dictionary of statistics
        """
        # get all patients
        all_patients = [key for key in stats['patients']['process']]
        set_pdata = set()
        # get all processes
        for patient in stats["patients"]['process']:
            for key in stats["patients"]['process'][patient]:
                set_pdata.add(key)
        for patient in stats["patients"]['wait']:
            for key in stats["patients"]['wait'][patient]:
                set_pdata.add(key)
        processes = list(set_pdata)
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

        formatted_stats = {"stats": stats["stats"], "hospital": hosptial_csv, "doctors": doctor_csv, "patients": patient_csv}
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


def producePatientData():
    time.sleep(random() * 2)
    jsonToSend = [{"patientId": 1, "from": randint(1, 10), "to": randint(1, 10)},
        {"patientId": 2, "from": randint(1, 10), "to": randint(1, 10)},
        {"patientId": 3, "from": randint(1, 10), "to": randint(1, 10)}]
    return json.dumps(jsonToSend)

# asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_forever()
# test travis

