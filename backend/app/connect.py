import asyncio
import websockets
import time

class Websocket:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.server = None
        self.clients = list()

    def register(self, client):
        """Register a WebSocket connection for Redis updates."""
        self.clients.append(client)

    def send(self, client, data):
        """Send given data to the registered client.
        Automatically discards invalid connections."""
        try:
            client.send(data)
        except Exception:
            self.clients.remove(client)

    def connect(self):
        self.server = websockets.serve(ws_handler=handler, host=self.host, port=self.port)

    def close(self):
        pass

# Sample test handler 
# async def hello(websocket, path):
#     name = await websocket.recv()

#     greeting = f"Hello {name}!"
#     await websocket.send(greeting)

#     while True:
#         await websocket.send(time.ctime())
#         time.sleep(5)
    
#     print(f"> {greeting}")

# start_server = websockets.serve(ws_handler=hello, host="localhost", port=8765)

# asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_forever()

async def hello(websocket, path):
    name = await websocket.recv()
    print(f"< {name}")

    greeting = f"Hello {name}!"

    await websocket.send(greeting)
    print(f"> {greeting}")

start_server = websockets.serve(hello, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()