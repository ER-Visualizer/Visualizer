
import numpy as np

from flask import Flask
app = Flask(__name__)

class Statistic:
    """
    Statistics class to store data throughout the simulation
    """

    def __init__(self):
        # Patient stats
        # structure: {'Patient_1': {'reception': 1 ...} ...}
        self.p_process_times = {}
        # structure: {'Patient_1': {'reception': 1 ...} ...}
        self.p_wait_times = {}
        # Doctor stats
        self.d_seen = {}
        self.d_length = {}
        # Hospital stats
        self.sum_ratio_wait = 0.0
        self.sum_ratio_journey = 0.0
        self.sum_utilization = 0
        self.start_time = float("INF")
        self.end_time = float("-INF")


    def calculate_stats(self, canvas):
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
        hospital_stats = self._calculate_hospital_avgs(canvas)
        util = hospital_stats["util"]
        del hospital_stats["util"]
        res = {"stats": "true", "hospital": hospital_stats,
               "patients": {"process": self.p_process_times, "wait": self.p_wait_times},
               "doctors": {"seen": self.d_seen, "length": self.d_length}, "util": util}
        return res

    def add_process_time(self, p_id, process, time):
        """
          Adds the time taken for a single patient in a specific process including wait time.
        """
        p_id = "Patient_" + str(p_id)
        if p_id not in self.p_process_times:
            self.p_process_times[p_id] = {}
        self.p_process_times[p_id][process] = time

    def add_wait_time(self, p_id, process, time):
        """
        Adds the wait time for a patient in a specific process
        """
        p_id = "Patient_" + str(p_id)
        if p_id not in self.p_wait_times:
            self.p_wait_times[p_id] = {}
        self.p_wait_times[p_id][process] = time

    def increment_doc_seen(self, d_id):
        """
        Increments the number of patients seen for a specific doctor
        """
        d_id = "Doctor_" + str(d_id)
        if d_id not in self.d_seen:
            self.d_seen[d_id] = 0
        self.d_seen[d_id] += 1

    def add_doc_patient_time(self, d_id, p_id, time):
        """
        Adds the patient doctor interaction time for a specific patient and
        specific doctor
        """
        d_id = "Doctor_" + str(d_id)
        p_id = "Patient_" + str(p_id)
        if d_id not in self.d_length:
            self.d_length[d_id] = {}
        if p_id not in self.d_length[d_id]:
            self.d_length[d_id][p_id] = []
        self.d_length[d_id][p_id].append(time)

    def _calculate_hospital_avgs(self, canvas):
        """
        Private helper to calculate hospital statistics

        Calculates average journey length, wait time, and ratio of wait time to journey length
        """
        # total journey times
        journey_lengths = []
        # total wait times
        wait_times = []
        ratio = []
        # time of starting and ending simulation
        total_simulation_time = self.end_time - self.start_time
        resources_utilization = {}
        for p_id in self.p_process_times:
            total_time = 0.0
            # total wait time
            wait_time = 0.0
            for resource in self.p_process_times[p_id]:
                # record a patients total wait time and time in a node throughout their journey
                total_time += self.p_process_times[p_id][resource]
                wait_time += self.p_wait_times[p_id][resource]
                if resource not in resources_utilization:
                    resources_utilization[resource] = 0.0
                # track how much of the simulation time the resource used processing patients (to know utilization)
                if p_id in self.p_wait_times and resource in self.p_wait_times[p_id]:
                    resource_wait = self.p_wait_times[p_id][resource]
                else:
                    resource_wait = 0
                resources_utilization[resource] += self.p_process_times[p_id][resource] - resource_wait

            journey_lengths.append(total_time)
            wait_times.append(wait_time)
            r = wait_time / total_time if total_time != 0 else 0
            ratio.append(r)
        for resource in resources_utilization:
            resources_utilization[resource] = float(resources_utilization[resource])/total_simulation_time if total_simulation_time != 0 else 0
        for node in canvas:
            if node["elementType"] in resources_utilization and node["numberOfActors"] != 0:
                resources_utilization[node["elementType"]] = resources_utilization[node["elementType"]]/node["numberOfActors"]
        app.logger.info("STATS")
        return {"journey": np.mean(journey_lengths), "wait": np.mean(wait_times), "ratio": np.mean(ratio), "util": resources_utilization}