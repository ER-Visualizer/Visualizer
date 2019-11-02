import os
import json
import datetime
from flask import Flask

# create the flask object
app = Flask(__name__)
from app import views
