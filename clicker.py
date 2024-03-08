import asyncio #pip install asyncio
import websockets #pip install websockets
import keyboard #pip install keyboard
import mouse #pip intall mouse
import time
import os

BUTTON_POSITIONS = (
    (944, 797),
    (2495, 794),
    (943, 1154),
    (2494, 1151)
)
NEXT_POSITION = (1726, 1164)

def stop():
    print("stopped")
    os._exit(0)

keyboard.add_hotkey("q", stop)

def clickIndex(i):
    mouse.move(BUTTON_POSITIONS[i][0], BUTTON_POSITIONS[i][1])
    mouse.click()
    
def clickNext():
    mouse.move(NEXT_POSITION[0], NEXT_POSITION[1])
    mouse.click()

async def handler(ws):
    while True:
        msg = await ws.recv()
        print(msg)
        
        if msg.startswith("CLICK"):
            index = int(msg[5])
            
            clickIndex(index)
            time.sleep(0.3)
            clickNext()
            time.sleep(0.05)
            
            await ws.send("NEXT")

async def main():
    async with websockets.serve(handler, "", 8001):
        print("Started on ws://localhost:8001")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
