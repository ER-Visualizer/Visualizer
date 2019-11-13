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
    def __init__(self, host, port, producerFunc, process, statistics):
        self.host = host
        self.port = port
        self.producerFunc = producerFunc
        self.server = None
        self.wserver = None
        self.process = process
        self.stats = statistics
        self.sent_stats = False

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
        check = self.process()
        print(check)
        message = self.producerFunc()
        if not check and not self.sent_stats:
            stats = self.stats()
            message = json.dumps(stats)
            self.sent_stats = True
        elif not check or message == []:
            message = '{"Event": {}}'
        else:
            self.sent_stats = False
        await websocket.send(message)
