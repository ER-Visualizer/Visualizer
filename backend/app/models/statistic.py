"""
Statistics class to store data throughout the simulation
"""
class Statistic:

    def __init__(self):
        # Patient stats
        self.p_triage_times = []
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
        avg_triage = sum(self.p_triage_times)/len(self.p_triage_times)
        avg_wait = sum(self.p_wait_times)/len(self.p_wait_times)
        ratio_w_j = self.sum_ratio_journey/self.sum_ratio_journey
        return {"avg_triage": avg_triage, "avg_wait": avg_wait, "ratio_w_j": ratio_w_j}

    """
    Adds the time taken for a single patient in a specific process including wait time.
    """
    def add_process_time(self, p_id, process, time):
        if p_id not in self.p_process_times:
            self.p_process_times[p_id] = {}
        self.p_process_times[p_id][process] = time

    def add_wait_time(self, p_id, process, time):
        if p_id not in self.p_process_times:
            self.p_wait_times[p_id] = {}
        self.p_wait_times[p_id][process] = time

    def increment_doc_seen(self, d_id):
        if d_id not in self.d_seen:
            self.d_seen[d_id] = 0
        self.d_seen[d_id] += 1

    def add_doc_patient_time(self, d_id, p_id, time):
        if d_id not in self.d_length:
            self.d_length[d_id] = {}
        if p_id not in self.d_length[d_id]:
            self.d_length[d_id][p_id] = []
        self.d_length[d_id][p_id].append(time)

    def add_journey_time(self, time):
        self.sum_ratio_journey += time
