class Patient():
    def __init__(self):
        self.is_available = True
        self.acuity = None
        self.start_time = None
        self.predicted_processes = {}
        self.needed_processes = {}

    def __init__(self, acuity):
        self.is_available = True
        self.acuity = acuity
        self.start_time = None
        self.predicted_processes = {}
        self.needed_processes = {}

    def __init__(self, acuity, start_time):
        self.is_available = True
        self.acuity = acuity
        self.start_time = start_time
        self.predicted_processes = {}
        self.needed_processes = {}

    ''' For use in comparison inside heaps. We will need to overwrite this
    with a priority function given to us from canvas'''

    def __lt__(self, other):
        return self.acuity > other.acuity

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

    def is_available(self):
        return self.is_available

    def set_unavailable(self):
        self.is_available = False

    def set_available(self):
        self.is_available = True
