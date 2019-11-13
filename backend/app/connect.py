import asyncio
import websockets
from random import randint, random
import json
import time
import signal
# class WebsocketServer:
#     def __init__(self, host, port, producerFunc):
#         self.host = host
#         self.port = port
#         self.producerFunc = producerFunc
#         self.clients = []
#         self.server = None

#     def start(self):
#         self.server = websockets.serve(ws_handler=self.__producer_handler, 
#             host=self.host, port=self.port)
#         asyncio.get_event_loop().run_until_complete(self.server)
#         asyncio.get_event_loop().run_forever()

#     def register(self, websocket):
#         self.clients.append(websocket)

#     def unregister(self, websocket):
#         self.clients.remove(websocket)

#     def stop(self):
#         asyncio.get_event_loop().stop()

#     async def __producer_handler(self, websocket, path):
#         self.register(websocket)
#         while True:
#             message = await self.producerFunc()
#             try:
#                 await asyncio.wait([client.send(message) for client in self.clients])
#             except:
#                 print("Got here")
#                 self.unregister(websocket)
#                 self.stop()
#                 break
# class Websocket:
#     def __init__(self, host, port):
#         self.host = host
#         self.port = port
#         self.producerFunc = producerFunc
#         self.clients = []
#         self.server = None

#     def start(self):
#         self.server = websockets.serve(ws_handler=self.__producer_handler, 
#             host=self.host, port=self.port)
#         asyncio.get_event_loop().run_until_complete(self.server)
#         asyncio.get_event_loop().run_forever()

#     def register(self, websocket):
#         self.clients.append(websocket)

#     def unregister(self, websocket):
#         self.clients.remove(websocket)

#     def stop(self):
#         asyncio.get_event_loop().stop()

#     async def __producer_handler(self, websocket, path):
#         self.register(websocket)
#         while True:
#             message = await self.producerFunc()
#             try:
#                 await asyncio.wait([client.send(message) for client in self.clients])
#             except:
#                 print("Got here")
#                 self.unregister(websocket)
#                 self.stop()
#                 break
# # class Websocket:
# #     def __init__(self, host, port):
# #         self.host = host
# #         self.port = port
# #         self.server = None
# #         self.clients = list()

# #     def register(self, client):
# #         """Register a WebSocket connection for Redis updates."""
# #         self.clients.append(client)

# #     def send(self, client, data):
# #         """Send given data to the registered client.
# #         Automatically discards invalid connections."""
# #         try:
# #             client.send(data)
# #         except Exception:
# #             self.clients.remove(client)

# #     def connect(self):
# #         self.server = websockets.serve(ws_handler=handler, host=self.host, port=self.port)

# #     def close(self):
# #         pass

# # Sample test handler 

# # async def hello(websocket, path):
# #     name = await websocket.recv()



# # start_server = websockets.serve(ws_handler=hello, host="localhost", port=8765)

# # asyncio.get_event_loop().run_until_complete(start_server)
# # asyncio.get_event_loop().run_forever()

# # import asyncio
# # import json
# # import logging
# # import websockets

# # logging.basicConfig()

# # STATE = {"value": 0}

# # USERS = set()


# # def state_event():
# #     return json.dumps({"type": "state", **STATE})


# # def users_event():
# #     return json.dumps({"type": "users", "count": len(USERS)})


# # async def notify_state():
# #     if USERS:  # asyncio.wait doesn't accept an empty list
# #         message = state_event()
# #         await asyncio.wait([user.send(message) for user in USERS])


# # async def notify_users():
# #     if USERS:  # asyncio.wait doesn't accept an empty list
# #         message = users_event()
# #         await asyncio.wait([user.send(message) for user in USERS])


# # async def register(websocket):
# #     USERS.add(websocket)
# #     await notify_users()


# # async def unregister(websocket):
# #     USERS.remove(websocket)
# #     await notify_users()


# # async def counter(websocket, path):
# #     # register(websocket) sends user_event() to websocket
# #     await register(websocket)
# #     try:
# #         await websocket.send(state_event())
# #         async for message in websocket:
# #             data = json.loads(message)
# #             if data["action"] == "minus":
# #                 STATE["value"] -= 1
# #                 await notify_state()
# #             elif data["action"] == "plus":
# #                 STATE["value"] += 1
# #                 await notify_state()
# #             else:
# #                 logging.error("unsupported event: {}", data)
# #     finally:
# #         await unregister(websocket)


# # start_server = websockets.serve(counter, "localhost", 6789)

# async def producePatientData():
#     await asyncio.sleep(4)
#     jsonToSend = [{"patientId": 1, "from": randint(1, 10), "to": randint(1, 10)},
#         {"patientId": 2, "from": randint(1, 10), "to": randint(1, 10)},
#         {"patientId": 3, "from": randint(1, 10), "to": randint(1, 10)}]
#     return json.dumps(jsonToSend)

# if __name__ == "__main__":
#     server = WebsocketServer("localhost", 8765, producePatientData)
#     server.start()

# url is ws://localhost:8765
import asyncio
import websockets

async def hello(websocket, path):
    name = await websocket.recv()
    print(f"< {name}")

    greeting = '{"userId": 3, "movedTo": 0, "startedAt": 1, "timeStamp": "0:03"}'

    await websocket.send(greeting)
    print(f"> {greeting}")

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





def producePatientData():
    time.sleep(random() * 2)
    jsonToSend = [{"patientId": 1, "from": randint(1, 10), "to": randint(1, 10)},
        {"patientId": 2, "from": randint(1, 10), "to": randint(1, 10)},
        {"patientId": 3, "from": randint(1, 10), "to": randint(1, 10)}]
    return json.dumps(jsonToSend)

# asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_forever()
# test travis