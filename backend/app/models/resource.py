class Resource:

    def __init__(self, id, resource_rules = []):
        self.id = id
        self.finish_time = None
        self.curr_patient = None
        self.duration = None
        self.resource_rules = resource_rules

    def get_resource_rules(self):
        return self.resource_rules
    def set_resource_rules(self, resource_rules):
        self.resource_rules = resource_rules

    # TODO Make sure that the actual patient is being changed,
    # and not a copy of it
    ''' return patient that finished '''

    def insert_patient(self, patient,node_id, finish_time, duration):
        self.curr_patient = patient
        self.curr_patient.set_unavailable(node_id, self.id, finish_time)
        self.finish_time = finish_time
        self.duration = duration

    def clear_patient(self):

        patient = self.curr_patient
        patient.set_available()
        self.curr_patient = None
        self.finish_time = None

        return patient

    def is_available(self):
        return self.curr_patient is None

    def get_id(self):
        return self.id

    def get_curr_patient(self):
        return self.curr_patient

    def get_finish_time(self):
        return self.finish_time

    def get_duration(self):
        return self.duration
