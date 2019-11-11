import heapq
import csv
from threading import Timer
from app.models.event import Event
from app.models.node import Node
from app.models.patient import Patient
from app.models.statistic import Statistic
from app.models.resource import Resource
from app.models.queues import Queue
from app.connect import WebsocketServer

# indexed by strings
canvas = {"elements": []}

# indexed by integers
nodes_list = {}

event_heap = []
event_changes = []
time = 0

# default: send 5 mins of data
packet_duration = 300

# default: send every 5 seconds
packet_rate = 5

# instantiate statistics
statistics = Statistic()

"""
Setup Canvas:

input = list of nodes [{id: ..., next: [...]}, ... ] as json
"""
def canvas_parser():
    canvas = {
        "elements": [
            {
                "id": 1,
                "elementType": "triage",
                "distribution": "gaussian",
                "distributionParameters": [3, 1],
                "numberOfActors": 10,
                "queueType": "stack",
                "priorityFunction": "",
                "children": [2, 3]
            },
            {
                "id": 2,
                "elementType": "patient",
                "distribution": "gaussian",
                "distributionParameters": [3, 1],
                "numberOfActors": 3,
                "queueType": "queue",
                "priorityFunction": "",
                "children": []
            },
            {
                "id": 3,
                "elementType": "x-ray",
                "distribution": "gaussian",
                "distributionParameters": [1, 1],
                "numberOfActors": 2,
                "queueType": "priority queue",
                "priorityFunction": "",
                "children": []
            }
        ]
    }

def patients_parser():
    return "patients.csv"

def create_queues():
    for node in canvas["elements"]:

        # treat reception node differently (for now, will always be a Queue() with 1 actor)
        if node["element_type"] == "reception":
            nodes_list[node[id]] = Node(node["id"], node["element_type"], node["distribution"], node["distributionParameters"],
                                        1, "queue", node["priorityFunction"], node["children"])

            
            # TODO: find a way to get patients.csv from frontend
            patients_csv = patients_parser()

            # read csv (for now, all patients added to reception queue at beginning)
            skipHeader = True
            dict_reader = csv.DictReader(patients_csv, delimiter=',')
            for row in dict_reader:
                if skipHeader:
                    skipHeader = False
                    continue
                else:
                    nodes_list[node[id]].put_patient_in_queue(
                        Patient(row["patient_acuity"], row["times"]))
        else:
            nodes_list[node[id]] = Node(node["id"], node["element_type"], node["distribution"], node["distributionParameters"],
                                        node["numberOfActors"], node["queueType"], node["priorityFunction"], node["children"])

    # TODO: pass the list of nodes to the Node class
    Node._create_resource_dict(nodes_list)


"""
Create event heap
"""
def create_heap(heap):
    heapq.heapify(heap)

"""
Sends changes to frontend and repeats at intervals dictated by packet_rate
"""
def send_events():
    if len(event_changes) == 0:
        # send nothing if no changes
        return 0

    new_changes = []
    start_time = event_changes[0].time
    new_changes.append(event_changes.pop(0))

    while (len(event_changes) > 0 and event_changes[0].get_event_time() - start_time <= packet_duration):
        new_changes.append(event_changes.pop(0))

    # TODO send new_changes to frontend


    # send again after some time
    Timer(packet_rate, send_events).start()

    # Returns number of items sent (for debuggging purposes)
    return len(new_changes)


def process_heap():

    # exit condition for __main__ loop
    if len(get_heap()) == 0:
        return False

    head = heapq.heappop(get_heap())

    if not isinstance(head, Event):
        raise Exception("Non Event object in event heap")

    # TODO: update statistics using time_diff
    time_diff = head.get_event_time() - get_curr_time()

    head_node = head.get_node_id()
    head_resource = head.get_resource()

    # check type of event
    # need to check if its a triage
    if nodes_list[head_node] == "triage":
        finish_time = head_resource.get_finish_time()

    # send patient to next queues
    nodes_list[head_node].handle_finished_patient(head_resource)

    # add to list of event changes
    event_changes.append(head)



    # continue __main__ loop
    return True

# TODO: statistics reporting
def report_statistics():
    raise Exception("Statistics are not implemented yet")


def get_heap():
    return event_heap

def get_curr_time():
    return time

def main():
    # this will read canvas json
    canvas_parser()

    create_heap(get_heap())

    # this will read patients csv
    create_queues()

    # setup websocket server
    server = WebsocketServer("localhost", 8765, send_events)
    server.start()

    # start sending every X seconds
    send_events()

    # process events until heap is emptied
    while (process_heap()):
        process_heap()

    report_statistics()



if __name__ == "__main__":
    main()