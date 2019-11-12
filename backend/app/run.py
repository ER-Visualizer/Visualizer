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
from app.models.global_time import GlobalTime
from app.models.global_heap import GlobalHeap

# indexed by strings
canvas = {"elements": []}

# indexed by integers
nodes_list = {}

event_heap = GlobalHeap.heap
event_changes = []
time = GlobalTime.time

packet_start = -1

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


def canvas_parser(canvas_json):
    global canvas
    canvas = {
        "elements": [
            {
                "id": 1,
                "elementType": "reception",
                "distribution": "binomial",
                "distributionParameters": [3, 1],
                "numberOfActors": 1,
                "queueType": "stack",
                "priorityFunction": "",
                "children": [2]
            },
            {
                "id": 2,
                "elementType": "triage",
                "distribution": "binomial",
                "distributionParameters": [3, 1],
                "numberOfActors": 10,
                "queueType": "stack",
                "priorityFunction": "",
                "children": [3, 4]
            },
            {
                "id": 3,
                "elementType": "patient",
                "distribution": "binomial",
                "distributionParameters": [3, 1],
                "numberOfActors": 3,
                "queueType": "queue",
                "priorityFunction": "",
                "children": []
            },
            {
                "id": 4,
                "elementType": "x-ray",
                "distribution": "binomial",
                "distributionParameters": [1, 1],
                "numberOfActors": 2,
                "queueType": "priority queue",
                "priorityFunction": "",
                "children": []
            }
        ]
    }


def create_queues():
    print("IN CQ")
    for node in canvas["elements"]:
        print("IN NODE")
        # treat reception node differently (for now, will always be a Queue() with 1 actor)
        if node["elementType"] == "reception":
            nodes_list[node["id"]] = Node(node["id"], "queue", node["priorityFunction"], 1, process_name=node["elementType"],
                                          distribution_name=node["distribution"], distribution_parameters=node["distributionParameters"],
                                          output_process_ids=node["children"])

            # TODO: find a way to get patients.csv from frontend

            # read csv (for now, all patients added to reception queue at beginning)
            dict_reader = csv.DictReader(
                open("app/models/sample_ED_input.csv"), delimiter=',')
            print("DICT")
            print(dict_reader)
            for row in dict_reader:
                print("adding patient to queue")
                # TODO: bug here: turn patient timestamp into time relative to initial time first, and then
                # append it
                next_patient = Patient(
                    int(row["patient_id"]), int(row["patient_acuity"]), int(row["times"]))
                nodes_list[node["id"]].put_patient_in_queue(next_patient)
        else:
            nodes_list[node["id"]] = Node(node["id"], node["queueType"], node["priorityFunction"], node["numberOfActors"],
                                        process_name=node["elementType"], distribution_name=node["distribution"],
                                        distribution_parameters=node["distributionParameters"], output_process_ids=node["children"])

        # # TODO: pass the list of nodes to the Node class
        # Node._create_resource_dict(nodes_list)


# """
# Create event heap
# """
# def create_heap(heap):
#     heapq.heapify(heap)

"""
Sends changes to frontend and repeats at intervals dictated by packet_rate
"""

def send_events():
    if len(event_changes) == 0:
        # send nothing if no changes
        return []

    new_changes = []
    global packet_start
    if packet_start == -1:
        packet_start = event_changes[0].time
    else:
        packet_start = packet_start + packet_duration

    while (len(event_changes) > 0 and event_changes[0].get_event_time() - packet_start <= packet_duration):
        for next_q in event_changes[0].get_next_nodes():
            event_dict = {
                "patientId": event_changes[0].get_patient_id(),
                "movedTo": next_q,
                "startedAt": event_changes[0].get_node_id(),
                "timeStamp": event_changes[0].get_event_time()
            }
            new_changes.append(event_dict)
        event_changes.pop(0)

    # TODO send new_changes to frontend

    # send again after some time (removed for producerFunc implementation)
    # Timer(packet_rate, send_events).start()

    return {"Events:": new_changes}


def process_heap():

    # exit condition for __main__ loop
    if len(event_heap) == 0:
        return False

    head = heapq.heappop(event_heap)

    if not isinstance(head, Event):
        raise Exception("Non Event object in event heap")

    # TODO: update statistics using time_diff
    time_diff = head.get_event_time() - time

    head_node_id = head.get_node_id()
    head_resource_id = head.get_node_resource_id()

    resource = nodes_list[head_node_id].get_resource(head_resource_id)
    print("resources in node")
    for r in nodes_list[head_node_id].resource_dict:
        print(r, nodes_list[head_node_id].resource_dict[r])
    # patient for the event
    patient = resource.get_curr_patient()
    if not patient:
        print(resource)
        print("NO PATIENT", head.get_node_id, head.get_node_resource_id(), head.patient_id)
    # time where patient finishes the process
    finish_time = resource.get_finish_time()
    # time where patient joins queue for the process
    join_queue_time = patient.get_join_queue_time()
    print("join queue time")
    print(join_queue_time)
    # the patient joins a new queue at the current time
    patient.set_join_queue_time(head.get_event_time())

    # record process time
    process_time = finish_time - join_queue_time
    process_name = nodes_list[head.get_node_id()]
    statistics.add_process_time(patient.get_id(), process_name, process_time)

    # record wait time
    wait_time = process_time - resource.get_duration()
    statistics.add_wait_time(patient.get_id(), process_name, process_time)

    # record doctor
    if process_name == "patient":
        doctor_id = resource.get_id()
        statistics.increment_doc_seen(doctor_id)
        # TODO
        # Length of doctor/patient interaction per patient per doctor
        # average or record all?
        # can remove in the future and just use process_times
        statistics.add_doc_patient_time(doctor_id, patient.get_id(), process_time)


    # send patient to next queues
    nodes_list[head_node_id].handle_finished_patient(head_resource_id)

    # add to list of event changes
    event_changes.append(head)

    # continue __main__ loop
    return True

# TODO: statistics reporting


def report_statistics():
    return statistics.calculate_stats()


# def get_heap():
#     return event_heap

def get_curr_time():
    return time

def main():
    print("IN MAIN")
    # this will read canvas json
    canvas_parser({})

    # create_heap(get_heap())

    # this will read patients csv
    print("create queues")
    create_queues()

    # setup websocket server
    # server = WebsocketServer("localhost", 8765, send_events)
    # server.start()

    # start sending every X seconds
    # send_events()

    # process events until heap is emptied
    while (process_heap()):
        process_heap()

    print(report_statistics())


if __name__ == "__main__":
    main()
