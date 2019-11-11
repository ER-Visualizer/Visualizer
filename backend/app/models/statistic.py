"""
Statistics class to store data throughout the simulation
"""
class Statistic:

    def __init__(self):
        # Patient stats
        self.p_triage_times = []
        self.p_wait_times = []
        # Doctor stats
        self.d_seen = 0
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

    def add_triage_time(self, time):
        self.p_triage_times.append(time)

    def add_wait_time(self, time):
        self.p_wait_times.append(time)

    def increment_seen(self):
        self.d_seen += 1

    def add_journey_time(self, time):
        self.sum_ratio_journey += time