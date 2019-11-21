import asyncio
import websockets
from random import randint, random
import json
import time
import signal


# Stop the loop concurrently
@asyncio.coroutine
def exit():
    loop = asyncio.get_event_loop()
    print("Stop")
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
        self.server = loop.run_until_complete(self.wserver)

        loop.run_forever()


    def close(self):
        self.server.close()
        print("closing socketssssssss")
        asyncio.get_event_loop().run_until_complete(self.server.wait_closed())
        asyncio.get_event_loop().stop()
        asyncio.get_event_loop().close()

    async def __producer_handler(self, websocket, path):
        while True:
            check = self.process()
            while check == 2:
                check = self.process()
            message = self.producerFunc()
            if not check and not self.sent_stats:
                stats = self.stats()
                message = json.dumps(stats)
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
            except websockets.exceptions.ConnectionClosed:
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

