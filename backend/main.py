from flask import Flask
from datetime import datetime
from .app import run
from flask import request, jsonify
from flask_cors import CORS
import json
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
    """
    Returns true if file is a csv
    :param filename: File name input as a str
    :return: Boolean
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'csv'


@app.route('/hello')
def home():
    return "hello world!"


@app.route('/start', methods=['POST'])
def start_simulation():
    app.logger.info("starting simulation")
    req_data = request.json
    if req_data:
        canvas = req_data['nodes']
        duration = req_data['duration']
        rate = req_data['rate']
        app.logger.info(f"canvas {canvas}, duration: {duration}, rate: {rate}")
        now = datetime.now()
        current_time = now.strftime("%H_%M_%S")
        path = '/app/canvas/' + current_time + '.txt'
        os.makedirs(os.path.dirname(path), exist_ok=True)
        # all uploaded canvas are automatically stored under /app/canvas folder locally
        with open(path, 'a') as output:
            output.write(json.dumps(canvas))
        run.main((canvas, duration, rate))
        return send_json_response({"msg": "Succesfully ran simulation"})
    else:
        return send_json_response({"msg": "Invalid Canvas"})


@app.route('/csv', methods=['POST'])
def store_csv():
    app.logger.info("recieved csv")
    if 'file' not in request.files:
        return send_json_response({"response": "no file part"})
    file = request.files['file']
    if file.filename == '':
        return send_json_response({"response": "file not sent"})
    if not allowed_file(file.filename):
        return send_json_response({"response": "file is not csv"})
    os.remove('/app/test.csv')
    file.stream.seek(0)
    file.save('/app/test.csv')
    now = datetime.now()
    current_time = now.strftime("%H_%M_%S")
    # all uploaded CSVs are automatically stored under /app/csv folder locally
    path = '/app/csv/' + current_time + ".csv"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    file.stream.seek(0)
    file.save(path)
    return send_json_response({"response": "uploaded csv to " + os.path.join('/app/', secure_filename('test.csv'))})


def send_json_response(message: dict):
    """
    Returns a json response.
    """
    resp = jsonify(message)
    resp.status_code = 200
    return resp


if __name__ == "__main__":
    app.run()


