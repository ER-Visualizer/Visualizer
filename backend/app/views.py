# where routes will be
from app import app
from flask import request, jsonify
from app.models.node import Node

from flask_cors import CORS, cross_origin
cors = CORS(app, resources={r"/start/*": {"origins": "*"}})

app.config['CORS_HEADERS'] = 'Content-Type'

import logging


# FOR TESTING
from .run import main
logger = logging.getLogger(__name__)

@app.route('/')
def home():
    main()
    return "hello world!"

@app.route('/start', methods=['POST'])
@cross_origin()
def start_simulation():
    req_data = request.get_json()
    if "elements" in req_data:
        elements = req_data['elements']
        list_of_nodes = []
        for element in elements:
            new_node = Node(element['id'],element['queueType'],
                element['priorityFunction'], element['numberOfActors'])
            new_node.set_process_name(element['elementType'])
            new_node.set_distribution(element['distribution'],element['distributionParameters'])
            new_node.set_output_process_ids(element['children'])
            list_of_nodes.append(new_node)
        app.logger.info(f"req data {req_data}")
    else:
        req_data = []
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
