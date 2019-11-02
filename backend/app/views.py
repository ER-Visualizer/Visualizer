# where routes will be
from app import app

@app.route('/')
def home():
   return "hello world!"

def function1():
  print("rer")
  print("ded")
  print("dd")
  pass