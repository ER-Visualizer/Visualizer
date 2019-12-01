# from app import app
from flask import Flask, request
# where routes will be
# FOR TESTING
import time
from .app import run
from flask import request, jsonify
from flask_cors import CORS, cross_origin
import os
from werkzeug.utils import secure_filename
app = Flask(__name__)


import logging

CORS(app)

logging.basicConfig(filename='debug.log', level=logging.DEBUG,
                    format='%(levelname)s: ER | Visualizer: %(asctime)s: %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S')
logger = logging.getLogger(__name__)

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'csv'

@app.route('/start', methods=['POST'])
def start_simulation():
    app.logger.info("starting simulation")
    req_data = request.json 
    if req_data:  
        canvas = req_data['nodes'] 
        duration = req_data['duration'] 
        rate = req_data['rate']
        # app.logger.info(f"canvas {canvas}, duration: {duration}, rate: {rate}")
        run.main((canvas, duration, rate))
        return send_json_response("Succesfully ran simulation")
    else:  
        print("hre") 
        return send_json_response("Invalid Canvas")

@app.route('/csv', methods=['POST'])
def store_csv():
    app.logger.info("recieved csv")
    if 'file' not in request.files:
        return send_json_response({"response": "no file part"})
    file = request.files['file']
    # app.logger.info(file)
    if file.filename == '':
        return send_json_response({"response": "file not sent"})
    if not allowed_file(file.filename):
        return send_json_response({"response": "file is not csv"})
    os.remove('/app/test.csv')
    file.stream.seek(0)
    file.save('/app/test.csv')
    return send_json_response({"response": "uploaded csv to " + os.path.join('/app/', secure_filename('test.csv'))})

"""
Returns a json response.
"""
def send_json_response(message: dict):
    resp = jsonify(message)
    resp.status_code = 200
    # app.logger.info(resp)
    return resp
 
if __name__ == "__main__":
  app.run()

