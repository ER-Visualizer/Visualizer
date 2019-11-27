import heapq
import csv
import json
from datetime import datetime
from .models.event import Event
from .models.node import Node
from .models.patient import Patient
from .models.statistic import Statistic
from .models.resource import Resource
from .models.queues import Queue
from .connect import WebsocketServer
from .models.global_time import GlobalTime
from .models.global_heap import GlobalHeap
from .models.global_strings import *
from .models.rules.frequency_rule import FrequencyRule
from .models.rules.prediction_rule import PredictionRule

# indexed by strings
canvas = {"elements": []}

# indexed by integers
nodes_list = {}
initial_time = None
event_heap = GlobalHeap.heap
event_changes = []

packet_start = -1

# default: send 5 mins of data
packet_duration = 300

# default: send every 5 seconds
packet_rate = 1

# instantiate statistics
statistics = Statistic()

# instantiate array of all patients
all_patients = {}

"""
Setup Canvas:

input = list of nodes [{id: ..., next: [...]}, ... ] as json
"""
counter = 0

def canvas_parser(canvas_json):
    global canvas
    canvas = {
        "elements": [
            {
                "id": 0,
                "elementType": "reception",
                "distribution": "fixed",
                "distributionParameters": [5],
                "numberOfActors": 1,
                "queueType": "priority queue",
                "priorityFunction": "",
                "children": [1],
                "predicted_children": [2]
            },
            {
                "id": 1,
                "elementType": "triage",
                "distribution": "fixed",
                "distributionParameters": [3],
                "numberOfActors": 2,
                "queueType": "priority queue",
                "priorityFunction": "",
                "children": [2, 3],
                "predicted_children": [2, 3]
            },
            {
                "id": 2,
                "elementType": "doctor",
                "distribution": "fixed",
                "distributionParameters": [10],
                "numberOfActors": 3,
                "queueType": "priority queue",
                "priorityFunction": "",
                "children": [3]
            },
            {
                "id": 3,
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
    global initial_time, nodes_list
    for node in canvas["elements"]:
        rules = []

        # create all of the rules here
        # TODO: delete this and create actual rules from JSON once JSON format is created
        
        frequency = FrequencyRule(node["elementType"], node["id"])
        rules.append(frequency)

        parent_ids = []

        for other_node in canvas["elements"]:
            if "predicted_children" in other_node and node["id"] in other_node["predicted_children"]:
                parent_ids.append(other_node["id"])

        prediction = PredictionRule(node["elementType"], node["elementType"], parent_ids)
        rules.append(prediction)

        # create node
        nodes_list[node["id"]] = Node(node["id"], node["queueType"], node["priorityFunction"], node["numberOfActors"],
                                        process_name=node["elementType"], distribution_name=node["distribution"],
                                        distribution_parameters=node["distributionParameters"], output_process_ids=node["children"], rules=rules)
        # TODO: why do we need this conditional. Can't we just add it outside of the for loop?
        # create patient_loader node when reception is found
        if node["elementType"] == "reception":
            nodes_list[-1] = Node(-1, "queue",  None, 1, process_name="patient_loader",
                                          distribution_name="fixed", distribution_parameters=[0],
                                          output_process_ids=[node["id"]])

            # TODO: find a way to get patients.csv from frontend
    print("open csv")
    # read csv (for now, all patients added to reception queue at beginning)
    with open("/app/test.csv") as csvfile:
        csvfile.seek(0)
        dict_reader = csv.DictReader(csvfile, delimiter=',')
        for row in dict_reader:
            print(row)
            if initial_time is None:
                initial_time = row["time"]
            FMT = '%Y-%m-%d %H:%M:%S.%f'
            patient_time = datetime.strptime(row["time"], FMT) - datetime.strptime(initial_time, FMT)
            patient_time = float(patient_time.seconds)/60
            row[START_TIME] = patient_time
            next_patient = Patient(row)
            # All of the patients first get loaded up into the
            nodes_list[-1].put_patient_in_node(next_patient)
            all_patients[next_patient.get_id()] = next_patient



# """
# Create event heaps
# """
"""
Sends changes to frontend and repeats at intervals dictated by packet_rate
"""
def send_e():
    global event_changes
    if len(event_changes) == 0:
        # send nothing if no changes
        return []
    new_changes = []
    global packet_start
    if packet_start == -1:
        packet_start = event_changes[0].get_event_time()
    else:
        packet_start = packet_start + packet_duration

    while (len(event_changes) > 0 and event_changes[0].get_event_time() - packet_start <= packet_duration):
        for next_q in event_changes[0].get_moved_to():
            curr_resource = nodes_list[event_changes[0].get_node_id()].get_resource(event_changes[0].get_node_resource_id())
            event_dict = {
                "patientAquity": all_patients[event_changes[0].get_patient_id()].get_acuity(),
                "patientidendy": all_patients[event_changes[0].get_patient_id()].get_id(),
                "patientId": event_changes[0].get_patient_id(),
                "curNodeId": event_changes[0].get_node_id(),
                "movedTo": nodes_list[next_q].get_process_name(),
                "nextNodeId": nodes_list[next_q].get_id(),
                "startedAt": nodes_list[event_changes[0].get_node_id()].get_process_name() + ":" + str(curr_resource.get_id()),
                "timeStamp": event_changes[0].get_event_time()
            }
            new_changes.append(event_dict)
        event_changes.pop(0)

    return json.dumps({"Events": new_changes})


def process_heap():
    # exit condition for simulation loop
    if len(event_heap) == 0:
        return 0

    completed_event = heapq.heappop(event_heap)
    # If an event just finished, that must be the current time, so update it.
    GlobalTime.time = completed_event.get_event_time()
    if not isinstance(completed_event, Event):
        raise Exception("Non Event object in event heap")


    head_node_id = completed_event.get_node_id()
    head_resource_id = completed_event.get_node_resource_id()
    resource = nodes_list[head_node_id].get_resource(head_resource_id)

    # patient record for the patient in the event
    patient_record = resource.get_curr_patient().get_patient_record()
    # NOTE: THE FOLLOWING ACTIONS MUST BE DONE IN THIS ORDER!!!
    process_duration = patient_record.get_curr_duration()
    # get time when patient entered finishing nodes
    join_queue_time = patient_record.get_end_time_of_last_process()
    # handle patient by placing it in its next node (either in a queue or directly into a resource)
    nodes_list[head_node_id].handle_finished_patient(head_resource_id)
    # get time when patient is leaving finishing node (which is also the time when patient joins current node)
    finish_time = patient_record.get_end_time_of_last_process()
    # record process time
    process_time = finish_time - join_queue_time
    process_name = nodes_list[completed_event.get_node_id()].get_process_name()
    statistics.add_process_time(patient_record.get_id(), process_name, process_time)
    # record wait time
    wait_time = process_time - process_duration
    statistics.add_wait_time(patient_record.get_id(), process_name, wait_time)

    # record doctor statistics
    if process_name == "doctor":
        doctor_id = resource.get_id()
        statistics.increment_doc_seen(doctor_id)
        # TODO
        # Length of doctor/patient interaction per patient per doctor
        # average or record all?
        # can remove in the future and just use process_times
        statistics.add_doc_patient_time(doctor_id, patient_record.get_id(), process_time)

    # get all queues patient was added to
    next_nodes = list(patient_record.get_queues_since_last_finished_process())  # create new list to prevent mutating it
    # get resource patient is in (if any)
    if patient_record.get_curr_process_id() is not None:
        next_nodes.append(patient_record.get_curr_process_id())
    # send patient to next queues/resources
    completed_event.set_moved_to(next_nodes)
    event_changes.append(completed_event)

    global counter, all_patients
    if counter < len(all_patients) - 1:
        counter += 1
        return 2
    # continue simulation loop
    return 1


def report_statistics():
    return statistics.calculate_stats()


def get_curr_time():
    return GlobalTime.time


def main():
    GlobalTime.time = 0
    GlobalHeap.heap = []
    global initial_time, nodes_list, event_changes, statistics, packet_start, counter, event_heap
    event_heap = GlobalHeap.heap
    initial_time = None
    event_changes = []
    nodes_list = {}
    statistics = Statistic()
    packet_start = -1

    # this will read canvas json
    canvas_parser({})

    # create_heap(get_heap())

    # this will read patients csv
    create_queues()
    counter = 0
    # setup websocket server
    server = WebsocketServer("localhost", 8765, send_e, process_heap, report_statistics, packet_rate)
    server.start()

    print(report_statistics())


if __name__ == "__main__":
    main()
