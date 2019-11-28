import numpy as np
from flask import Flask
app = Flask(__name__)


import logging

"""
Statistics class to store data throughout the simulation
"""
class Statistic:

    def __init__(self):
        # Patient stats
        self.p_times = {}
        # Doctor stats
        self.doctor_data = {}
        # Hospital stats
        self.sum_ratio_wait = 0.0
        self.sum_ratio_journey = 0.0
        self.sum_utilization = 0

    """
    Return current statistics
    
    Format:
    
    hospital: Hospital statistics: Average total journey time, average total wait time, average ratio of wait time to journey
    patient: process: For each patient, the total time spent at each process
    patient: wait: For each patient, the total wait time at each process
    doctor: seen: For each doctor, the total number of patients seen
    doctor: length: For each doctor, the length of the patient doctor interaction of each patient (is a list since there
    can be more than one PD interaction
    """
    def calculate_stats(self):
        hospital_stats = self._calculate_hospital_avgs()
        res = {"stats": "true", "hospital": hospital_stats, "patients": self.p_times,
               "doctors": self.doctor_data}
        return res

    """
    Adds the time taken for a single patient in a specific process including wait time.
    """
    def add_process_time(self, p_id, process, time):
        p_id = "Patient_" + str(p_id) 
        if p_id not in self.p_times:
            self.p_times[p_id] = {}
        self.p_times[p_id][f"{process}-process"] = time

    """
    Adds the wait time for a patient in a specific process
    """
    def add_wait_time(self, p_id, process, time):
        p_id = "Patient_" + str(p_id) 
        if p_id not in self.p_times:
            self.p_times[p_id] = {}
        self.p_times[p_id][f"{process}-wait"] = time

    """
    Increments the number of patients seen for a specific doctor
    """
    def increment_doc_seen(self, d_id):
        d_id = "Doctor_" + str(d_id)
        if d_id not in self.doctor_data:
             self.doctor_data[d_id] = {}
        if "seen" not in self.d_doctor_dataseen[d_id]:
             self.d_doctor_dataseen[d_id]["seen"] = 0
        self.doctor_data[d_id]["seen"] += 1

    """
    Adds the patient doctor interaction time for a specific patient and 
    specific doctor
    """
    def add_doc_patient_time(self, d_id, p_id, time):
        d_id = "Doctor_" + str(d_id)
        p_id = "Patient_" + str(p_id)
        if d_id not in self.doctor_data:
            self.doctor_data[d_id] = {}
        if f"{p_id}-length" not in self.doctor_data[d_id]:
            self.doctor_data[d_id][f"{p_id}-length"] = []
        if "seen" not in self.doctor_data[d_id]:
             self.doctor_data[d_id]["seen"] = 0
        self.doctor_data[d_id]["seen"] += 1
        self.doctor_data[d_id][f"{p_id}-length"].append(time)

    """
    Private helper to calculate hospital statistics
    
    Calculates average journey length, wait time, and ratio of wait time to journey length
    """
    def _calculate_hospital_avgs(self):
        # total journey times
        journey_lengths = []
        # total wait times
        wait_times = []
        ratio = []
        for p_id in self.p_times:
            total_time = 0.0
            # total wait time
            wait_time = 0.0
            for resource in self.p_times[p_id]:
                general_resource = resource.split("-")
                if general_resource[1] == "wait":
                    wait_time += self.p_times[p_id][resource]
                else:
                    total_time += self.p_times[p_id][resource]
               

            journey_lengths.append(total_time)
            wait_times.append(wait_time)
            r = wait_time/total_time if total_time != 0 else 0
            ratio.append(r)

        # TODO Summary stats for utilization ratio of hospital resources (e.g. CT scan)
        return {"journey": np.mean(journey_lengths), "wait": np.mean(wait_times), "ratio": np.mean(ratio)}


