import asyncio
import websockets
from random import randint, random
from flask import Flask
import json
import time
import signal

app = Flask(__name__)

import logging

# Stop the loop concurrently
@asyncio.coroutine
def exit():
    loop = asyncio.get_event_loop()
    app.logger.info("Stop")
    loop.stop()


def ask_exit():
    for task in asyncio.Task.all_tasks():
        task.cancel()
    asyncio.ensure_future(exit())

class WebsocketServer:
    def __init__(self, host, port, producerFunc, process, statistics, packet_rate):
        self.host = host
        self.port = port
        self.producerFunc = producerFunc
        self.server = None
        self.wserver = None
        self.process = process
        self.stats = statistics
        self.sent_stats = False
        self.packet_rate = packet_rate

    def start(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        self.wserver = websockets.serve(self.__producer_handler, port=self.port, loop=loop)
        try:
            self.server = loop.run_until_complete(self.wserver)
        except Exception:
            self.close()

        loop.run_forever()


    def close(self):
        self.server.close()
        app.logger.info("closing sockets")
        asyncio.get_event_loop().run_until_complete(self.server.wait_closed())
        asyncio.get_event_loop().stop()
        asyncio.get_event_loop().close()

    async def get_formatted_stats(self, stats):
        all_patients = [key for key in stats['patients']['process']]
        set_pdata = set()
        for patient in stats["patients"]['process']:
            for key in stats["patients"]['process'][patient]:
                set_pdata.add(key)
        for patient in stats["patients"]['wait']:
            for key in stats["patients"]['wait'][patient]:
                set_pdata.add(key)
        processes = list(set_pdata)
        patient_headers = ["Patient ID"]
        app.logger.info(stats)
        for process in processes:
            patient_headers.append(process + "_process_time")
            patient_headers.append(process + "_wait_time")
        patient_csv = [patient_headers]
        for patient in all_patients:
            res = [patient]
            for process in processes:
                if patient in stats['patients']['process'] and process in stats['patients']['process'][patient]:
                    process_time = stats['patients']['process'][patient][process]
                else:
                    process_time = "None"
                if patient in stats['patients']['wait'] and process in stats['patients']['wait'][patient]:
                    wait_time = stats['patients']['wait'][patient][process]
                else:
                    wait_time = "None"
                res.append(process_time)
                res.append(wait_time)
            patient_csv.append(res)

        all_doctors = [key for key in stats['doctors']['seen']]
        doctor_headers = ["Doctor ID", "seen"]
        for patient in all_patients:
            doctor_headers.append(patient)
        doctor_csv = [doctor_headers]
        for doctor in all_doctors:
            res = [doctor, stats['doctors']['seen'][doctor]]
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



    #
    # async def get_formatted_stats(self, stats):
    #     set_pdata = set()
    #     for patient in stats["patients"]:
    #         for key in stats["patients"][patient]:
    #             set_pdata.add(key)
    #         break
    #     patient_keys = list(set_pdata)
    #     patient_header = ["Patient id"]
    #     patient_header.extend(patient_keys)
    #     # get doctor header data
    #     set_ddata = set()
    #     for doctor in stats["doctors"]:
    #         for key in stats["doctors"][doctor]:
    #             set_ddata.add(key)
    #     doctor_keys = list(set_ddata)
    #     doctor_header = ["Doctor id"]
    #     doctor_header.extend(doctor_keys)
    #     # get hospital headers
    #     hospital_keys = list(stats["hospital"].keys())
    #
    #
    #
    #     formatted_stats = {"stats": stats["stats"], "patients": [patient_header], "hospital": [hospital_keys], "doctors": [doctor_header]}
    #     for key in stats:
    #         app.logger.info(key)
    #         if key == "patients":
    #             for p in stats[key]:
    #                 patient_id = p.split("_")[1]
    #                 curp_data = [patient_id]
    #                 for i in range(len(stats[key][p])):
    #                     curp_data.append(stats[key][p][patient_keys[i]])
    #                 formatted_stats['patients'].append(curp_data)
    #         if key == "doctors":
    #             for d in stats[key]:
    #                 d_id = d.split("_")[1]
    #                 curd_data = [d_id]
    #                 for i in range(len(stats[key][d])):
    #                     app.logger.info("for loop")
    #                     app.logger.info(stats[key])
    #                     app.logger.info(stats[key][d])
    #                     app.logger.info(doctor_keys[i])
    #                     if doctor_keys[i] not in stats[key][d]:
    #                         curd_data.append("None")
    #                     else:
    #                         curd_data.append(stats[key][d][doctor_keys[i]])
    #                 if len(curd_data) != len(doctor_header):
    #                     for j in range(len(doctor_header)-len(curd_data)):
    #                         curd_data.append("None")
    #                 formatted_stats['doctors'].append(curd_data)
    #         if key == "hospital":
    #             curh_data = []
    #             for i in range(len(stats["hospital"])):
    #                 curh_data.append(stats["hospital"][hospital_keys[i]])
    #             formatted_stats['hospital'].append(curh_data)
    #     return formatted_stats

    async def __producer_handler(self, websocket, path):
        while True:
            check = self.process()
            while check == 2:
                check = self.process()
            message = self.producerFunc()
            if not check and not self.sent_stats:
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
                await websocket.send(message)
                await asyncio.sleep(self.packet_rate)
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

