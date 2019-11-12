import numpy as np

"""
Statistics class to store data throughout the simulation
"""
class Statistic:

    def __init__(self):
        # Patient stats
        self.p_process_times = {}
        self.p_wait_times = {}
        # Doctor stats
        self.d_seen = {}
        self.d_length = {}
        # Hospital stats
        self.sum_ratio_wait = 0.0
        self.sum_ratio_journey = 0.0
        self.sum_utilization = 0

    """
    Return current statistics
    """
    def calculate_stats(self):
        hospital_stats = self._calculate_hospital_avgs()
        res = {"hospital": hospital_stats, "patient": {"process": self.p_process_times, "wait": self.p_wait_times},
               "doctor": {"seen": self.d_seen, "length": self.d_length}}
        return res

    """
    Adds the time taken for a single patient in a specific process including wait time.
    """
    def add_process_time(self, p_id, process, time):
        p_id = "Patient_" + str(p_id)
        if p_id not in self.p_process_times:
            self.p_process_times[p_id] = {}
        self.p_process_times[p_id][process] = time

    """
    Adds the wait time for a patient in a specific process
    """
    def add_wait_time(self, p_id, process, time):
        p_id = "Patient_" + str(p_id)
        if p_id not in self.p_wait_times:
            self.p_wait_times[p_id] = {}
        self.p_wait_times[p_id][process] = time

    """
    Increments the number of patients seen for a specific doctor
    """
    def increment_doc_seen(self, d_id):
        d_id = "Doctor_" + str(d_id)
        if d_id not in self.d_seen:
            self.d_seen[d_id] = 0
        self.d_seen[d_id] += 1

    """
    Adds the patient doctor interaction time for a specific patient and 
    specific doctor
    """
    def add_doc_patient_time(self, d_id, p_id, time):
        d_id = "Doctor_" + str(d_id)
        p_id = "Patient_" + str(p_id)
        if d_id not in self.d_length:
            self.d_length[d_id] = {}
        if p_id not in self.d_length[d_id]:
            self.d_length[d_id][p_id] = []
        self.d_length[d_id][p_id].append(time)

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
        for p_id in self.p_process_times:
            total_time = 0.0
            # total wait time
            wait_time = 0.0
            for resource in self.p_process_times[p_id]:
                total_time += self.p_process_times[p_id][resource]
                wait_time += self.p_wait_times[p_id][resource]

            journey_lengths.append(total_time)
            wait_times.append(wait_time)
            r = wait_time/total_time if total_time != 0 else 0
            ratio.append(r)

        # TODO Summary stats for utilization ratio of hospital resources (e.g. CT scan)
        return {"journey": np.mean(journey_lengths), "wait": np.mean(wait_times), "ratio": np.mean(ratio)}


