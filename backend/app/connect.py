import asyncio
import websockets
import time

async def hello(websocket, path):
    name = await websocket.recv()

    greeting = f"Hello {name}!"
    await websocket.send(greeting)

    while True:
        await websocket.send(time.ctime())
        time.sleep(5)
    
    print(f"> {greeting}")

start_server = websockets.serve(hello, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()