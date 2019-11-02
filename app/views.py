# where routes will be
from app import app

@app.route('/')
def home():
   return "hello world!"