class Patient():
    def __init__(self):
        self.acuity = None
        self.needed_processes = None
        self.start_time = None
        self.predicted_processes = {}
        self.needed_processes = {}

    def __init__(self, acuity):
        self.acuity = acuity

    def __init__(self, acuity, start_time):
        self.acuity = acuity
        self.start_time = start_time

    def set_acuity(self, acuity):
        self.acuity = acuity

    def set_needed_processes(self, needed_processes):
        self.needed_processes = needed_processes

    def set_start_time(self, start_time):
        self.start_time = start_time

    def set_predicted_processes(self, set_predicted_processes):
        self.set_predicted_processes = set_predicted_processes

    def set_needed_processes(self, needed_processes):
        self.needed_processes = needed_processes

