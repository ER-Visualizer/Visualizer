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
from .models.global_events import GlobalEvents
from .models.global_strings import *
from .models.rules.frequency_rule import FrequencyRule
from .models.rules.prediction_rule import PredictionRule
from flask import Flask
import threading
import os
from dotenv import load_dotenv

app = Flask(__name__)
dotenv_path = '/app/.env'
load_dotenv(dotenv_path)

# indexed by strings, args from post request
canvas = {}
duration = 0
rate = 0

# indexed by integers
nodes_list = {}
initial_time = None
event_heap = GlobalHeap.heap
event_changes = GlobalEvents.event_changes

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
    canvas = canvas_json


class SimulationWorker(threading.Thread):
    """
    Worker that starts the simulation on a thread

    Needed so that simulation can run in parallel to websocket thread for
    sending events to the frontend
    """
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self)-> None:
        """
        Reads the input canvas and csv file then starts the simulation
        """
        global initial_time, nodes_list
        for node in canvas:
            app.logger.info(f"cur node {node}")
            rules = []
            # create all of the rules here
            # TODO: delete this and create actual rules from JSON once JSON format is created

            # create node
            nodes_list[node["id"]] = Node(node["id"], node["queueType"], node["priorityFunction"], node["numberOfActors"],
                                            process_name=node["elementType"], distribution_name=node["distribution"],
                                            distribution_parameters=node["distributionParameters"], output_process_ids=node["children"], rules=rules,
                                            priority_type=node["priorityType"])

            # create patient_loader node when reception is found
            if node["elementType"] == "reception":
                nodes_list[-1] = Node(-1, "queue",  None, 1, process_name="patient_loader",
                                              distribution_name="fixed", distribution_parameters=[0],
                                              output_process_ids=[node["id"]], priority_type="")

        app.logger.info("open csv")
        # read csv
        with open("/app/test.csv") as csvfile:
            csvfile.seek(0)
            dict_reader = csv.DictReader(csvfile, delimiter=',')
            for row in dict_reader:
                app.logger.info(row)
                if initial_time is None:
                    initial_time = row["time"]
                FMT = '%Y-%m-%d %H:%M:%S.%f'
                patient_time = datetime.strptime(row["time"], FMT) - datetime.strptime(initial_time, FMT)
                patient_time = float(patient_time.seconds)/60
                row[START_TIME] = patient_time
                next_patient = Patient(row)
                # All of the patients first get loaded up into the patient loader node
                # each patient will stay in the patient loader until their start time
                nodes_list[-1].put_patient_in_node(next_patient)
                all_patients[next_patient.get_id()] = next_patient



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
    # ensure events are sorted
    event_changes.sort(key=lambda k: k.get_event_time())
    # set packet_start to be the first event's start time
    if packet_start == -1:
        packet_start = event_changes[0].get_event_time()
    else:
        packet_start = packet_start + packet_duration
    # traverse through each event, while the event is within the time range we want to consider
    while (len(event_changes) > 0 and event_changes[0].get_event_time() - packet_start <= packet_duration):
        # ignore event if moving to patient loader (frontend doesn't need this)
        if event_changes[0].get_moved_to() is not None and len(event_changes[0].get_moved_to()) > 0 and event_changes[0].get_moved_to()[0] == -1:
            pass
        # ignore event if finishing patient loader
        elif event_changes[0].get_finished() is True and event_changes[0].get_node_id() == -1:
            pass
        # event where patient left a resource
        elif event_changes[0].get_finished() is True:
            app.logger.info("Patient: " + str(all_patients[event_changes[0].get_patient_id()].get_id()) + " exited")
            event_dict = {
                "patientAquity": all_patients[event_changes[0].get_patient_id()].get_acuity(),
                "patientId": all_patients[event_changes[0].get_patient_id()].get_id(),
                "curNodeId": event_changes[0].get_node_id(),
                "nextNodeId": "end",
                "movedTo": "None",
                "startedAt": nodes_list[event_changes[0].get_node_id()].get_process_name(),
                "timeStamp": event_changes[0].get_event_time(),
                "inQueue": False
            }
            new_changes.append(event_dict)
        else:
            # event where patient is joining a queue or resource
            for next_q in event_changes[0].get_moved_to():
                event_dict = {
                    "patientAcuity": all_patients[event_changes[0].get_patient_id()].get_acuity(),
                    "patientId": all_patients[event_changes[0].get_patient_id()].get_id(),
                    "curNodeId": event_changes[0].get_node_id(),
                    "nextNodeId": nodes_list[next_q].get_id(),
                    "movedTo": nodes_list[next_q].get_process_name(),
                    "startedAt": nodes_list[event_changes[0].get_node_id()].get_process_name(),
                    "timeStamp": event_changes[0].get_event_time(),
                    "inQueue": event_changes[0].get_in_queue()
                }
                new_changes.append(event_dict)
        # handled event so remove it
        event_changes.pop(0)

    return json.dumps({"Events": new_changes})


def process_heap():
    """
    Processes the event with the lowest timestamp in the event_heap and
    calls handle_finished_patient to trigger subsequent events.

    Also in charge of reporting statistics to the Statistics class

    :return: int:
    0 = simulation has ended
    1 = simulation should continue
    """
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
    # ignore this event is resource is None
    if resource is None:
        return 1
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

    # continue simulation loop
    return 1


def report_statistics():
    return statistics.calculate_stats()


def get_curr_time():
    return GlobalTime.time


def main(args=()):
    app.logger.info("starting simulation in main")
    app.logger.info("Environment: ")
    app.logger.info(os.environ.get("DEV_ENV"))
    # resets all variables for the simulation
    # required in case user stops simulation mid way and runs again
    GlobalTime.time = 0
    GlobalHeap.heap = []
    global initial_time, nodes_list, event_changes, statistics, packet_start, counter, event_heap
    event_heap = GlobalHeap.heap
    initial_time = None

    GlobalEvents.event_changes = []
    event_changes = GlobalEvents.event_changes
    nodes_list = {}
    statistics = Statistic()

    packet_start = -1
    # read args from post request  s
    global canvas, duration, rate 
    canvas, duration, rate = args
    app.logger.info(f"canvas {canvas}, duration: {duration}, rate: {rate}")
    global packet_duration, packet_rate
    packet_duration = int(duration) * 60
    packet_rate = int(rate)

    # this will read canvas json
    canvas_parser(canvas)

    counter = 0
    # this will read patients csv
    worker = SimulationWorker()
    worker.start()
    # setup websocket server
    server = WebsocketServer("localhost", os.environ.get("WEB_SOCKET_PORT"), send_e, process_heap, report_statistics, packet_rate)
    server.start()

    app.logger.info(report_statistics())


if __name__ == "__main__":
    main()
