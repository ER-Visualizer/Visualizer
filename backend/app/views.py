# where routes will be
from app import app

@app.route('/')
def home():
   return "hello world!"

@app.route('/start', methods=['POST'])
def start_simulation():
    req_data = request.get_json()
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