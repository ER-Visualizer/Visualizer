# where routes will be
from app import app

@app.route('/')
def home():
   return "hello world!"

@app.route('/',methods=['GET'])
def start_simulation():
   # call a function from run.py to start simulation
   pass

def function1():
  print("rer")
  print("ded")
  print("dd")
  pass