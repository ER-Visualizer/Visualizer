# where routes will be
from app import app
from flask import request, jsonify

import logging

logger = logging.getLogger(__name__)

@app.route('/')
def home():
   return "hello world!"

@app.route('/start', methods=['POST'])
def start_simulation():
    req_data = request.get_json()
    
    app.logger.info(f"req data {req_data}")
   
    # TODO: call a function from run.py to start simulation
    return send_json_response(req_data)

"""
Returns a json response.
"""
def send_json_response(message: dict):
    resp = jsonify(message)
    resp.status_code = 200
    print(resp)
    return resp