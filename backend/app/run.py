import heapq
import csv
import json
from datetime import datetime
from threading import Timer
from .models.event import Event
from .models.node import Node
from .models.patient import Patient
from .models.statistic import Statistic
from .models.resource import Resource
from .models.queues import Queue
from .connect import WebsocketServer
from .models.global_time import GlobalTime
from .models.global_heap import GlobalHeap
from threading import Thread
# indexed by strings
canvas = {"elements": []}

# indexed by integers
nodes_list = {}
initial_time = None
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
                "distribution": "test",
                "distributionParameters": [5],
                "numberOfActors": 1,
                "queueType": "stack",
                "priorityFunction": "",
                "children": [2]
            },
            {
                "id": 2,
                "elementType": "triage",
                "distribution": "test",
                "distributionParameters":[3],
                "numberOfActors": 2,
                "queueType": "stack",
                "priorityFunction": "",
                "children": [3, 4]
            },
            {
                "id": 3,
                "elementType": "doctor",
                "distribution": "test",
                "distributionParameters": [10],
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
                "queueType": "queue",
                "priorityFunction": "",
                "children": []
            }
        ]
    }


def create_queues():
    print("IN CQ")
    global initial_time
    for node in canvas["elements"]:
        print("IN NODE")

        # create node
        nodes_list[node["id"]] = Node(node["id"], node["queueType"], node["priorityFunction"], node["numberOfActors"],
                                        process_name=node["elementType"], distribution_name=node["distribution"],
                                        distribution_parameters=node["distributionParameters"], output_process_ids=node["children"])

        # create patient_loader node when reception is found
        if node["elementType"] == "reception":
            nodes_list[-1] = Node(-1, "queue",  None, 1, process_name="patient_loader",
                                          distribution_name="test", distribution_parameters=[0],
                                          output_process_ids=[node["id"]])

            # TODO: find a way to get patients.csv from frontend

            # read csv (for now, all patients added to reception queue at beginning)
            dict_reader = csv.DictReader(
                open("app/models/sample_ED_input_3days.csv"), delimiter=',')
            print("DICT")
            print(dict_reader)
            for row in dict_reader:
                print("adding patient to queue")#
                if initial_time is None:
                    initial_time = row["times"]
                FMT = '%Y-%m-%d %H:%M:%S'
                patient_time = datetime.strptime(row["times"], FMT) - datetime.strptime(initial_time, FMT)
                patient_time = float(patient_time.seconds)/60
                next_patient = Patient(
                    int(row["patient_id"]), int(row["patient_acuity"]), patient_time)
                nodes_list[-1].put_patient_in_queue(next_patient)



# """
# Create event heap
# """
# def create_heap(heap):
#     heapq.heapify(heap)

"""
Sends changes to frontend and repeats at intervals dictated by packet_rate
"""

def send_e():
    global event_changes
    if len(event_changes) == 0:
        # print("NO EVENTS CHANGE")
        # send nothing if no changes
        return []
    else:
        # print("EVENT CHANGEs")

    new_changes = []
    global packet_start
    if packet_start == -1:
        packet_start = event_changes[0].get_event_time()
    else:
        packet_start = packet_start + packet_duration

    while (len(event_changes) > 0 and event_changes[0].get_event_time() - packet_start <= packet_duration):
        for next_q in event_changes[0].get_next_nodes():
            curr_resource = nodes_list[event_changes[0].get_node_id()].get_resource(event_changes[0].get_node_resource_id())
            # next_resource = nodes_list[next_q].get_resource(nodes_list[next_q].get_node_resource_id())
            event_dict = {
                "patientId": event_changes[0].get_patient_id(),
                "movedTo": nodes_list[next_q].get_process_name(),
                "startedAt": nodes_list[event_changes[0].get_node_id()].get_process_name() + ":" + str(curr_resource.get_id()),
                "timeStamp": event_changes[0].get_event_time()
            }
            new_changes.append(event_dict)
        event_changes.pop(0)

    # TODO send new_changes to frontend !
    # print("changes!!!", new_changes)
    # send again after some time (removed for producerFunc implementation)
    # Timer(packet_rate, send_events).start()

    return json.dumps({"Events": new_changes})


def process_heap():

    # exit condition for __main__ loop
    if len(event_heap) == 0:
        print("event heap emptyy")
        return False

    completed_event = heapq.heappop(event_heap)
    # If an event just finished, that must be the current time, so update it.
    GlobalTime.time = completed_event.get_event_time()
    if not isinstance(completed_event, Event):
        raise Exception("Non Event object in event heap")

    # TODO: update statistics using time_diff
    time_diff = completed_event.get_event_time() - time

    head_node_id = completed_event.get_node_id()
    head_resource_id = completed_event.get_node_resource_id()

    resource = nodes_list[head_node_id].get_resource(head_resource_id)
    print("resources in node")
    for r in nodes_list[head_node_id].resource_dict:
        print(r, nodes_list[head_node_id].resource_dict[r])
    # patient for the event
    patient = resource.get_curr_patient()

    # time where patient finishes the process
    finish_time = resource.get_finish_time()
    # time where patient joins queue for the process
    join_queue_time = patient.get_join_queue_time()
    print("join queue time")
    print(join_queue_time)
    # the patient joins a new queue at the current time
    patient.set_join_queue_time(completed_event.get_event_time())

    # record process time
    process_time = finish_time - join_queue_time
    process_name = nodes_list[completed_event.get_node_id()].get_process_name()
    statistics.add_process_time(patient.get_id(), process_name, process_time)

    # record wait time
    wait_time = process_time - resource.get_duration()
    statistics.add_wait_time(patient.get_id(), process_name, wait_time)

    # record doctor
    if process_name == "doctor":
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
    print("event changes", event_changes)
    event_changes.append(completed_event)

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
    GlobalTime.time = 0
    global initial_time, nodes_list, event_changes, statistics, packet_start
    initial_time = None
    event_changes = []
    nodes_list = {}
    statistics = Statistic()
    packet_start = -1

    # this will read canvas json
    canvas_parser({})

    # create_heap(get_heap())

    # this will read patients csv
    print("create queues")
    create_queues()

    # setup websocket server
    server = WebsocketServer("localhost", 8765, send_e, process_heap, report_statistics)
    server.start()

    # start sending every X secondss
    # send_e() pls

    # process events until heap is emptiedddd
    print("before processheap")
    while (process_heap()):
        print("processheap")
        process_heap()

    print(report_statistics())


if __name__ == "__main__":
    main()
