import asyncio
import websockets
from random import randint, random
import json

class WebsocketServer:
    def __init__(self, host, port, producerFunc):
        self.host = host
        self.port = port
        self.producerFunc = producerFunc
        self.server = None

    def start(self):
        self.server = websockets.serve(ws_handler=self.__producer_handler, 
            host=self.host, port=self.port)
        asyncio.get_event_loop().run_until_complete(self.server)
        asyncio.get_event_loop().run_forever()

    def close(self):
        asyncio.get_event_loop().stop()

    async def __producer_handler(self, websocket, path):
        while True:
            message = await self.producerFunc()
            try:
                await websocket.send(message)
            except websockets.exceptions.ConnectionClosed:
                self.close()
                break




async def producePatientData():
    await asyncio.sleep(random() * 2)
    jsonToSend = [{"patientId": 1, "from": randint(1, 10), "to": randint(1, 10)},
        {"patientId": 2, "from": randint(1, 10), "to": randint(1, 10)},
        {"patientId": 3, "from": randint(1, 10), "to": randint(1, 10)}]
    return json.dumps(jsonToSend)

if __name__ == "__main__":
    server = WebsocketServer("localhost", 8765, producePatientData)
    server.start()
