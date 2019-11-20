# from app import app
from flask import Flask
# where routes will be
# FOR TESTING
from .app import run
from flask import request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)


import logging

CORS(app)

logger = logging.getLogger(__name__)


@app.route('/hello')
def home():
    # main()
    return "hello world!"


@app.route('/start', methods=['POST'])
def start_simulation():
    app.logger.info("starting simulation")
    req_data = request.get_json()
    app.logger.info(f"req data {req_data}")
    run.main()
    # TODO: call a function from run.py to start simulation
    return send_json_response(req_data)


"""
Returns a json response.
"""


def send_json_response(message: dict):
    resp = jsonify(message)
    resp.status_code = 200
    # print(resp)
    return resp
 
if __name__ == "__main__":
  app.run()

