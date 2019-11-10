
class Resource():

    def __init__(self, id):
        self.id = id
        self.finish_time = None
        self.curr_patient = None

    '''
    This is a rule that the resource/subproces might have. If no rule(ordinary actor/resource), then just return True.
    Otherwise subclass it, and set it a rule.
    '''
    def pass_rule(self, patient):
        return True

    # TODO Make sure that the actual patient is being changed, and not a copy of it
    ''' return patient that finished '''
    def insert_patient(self, patient, finish_time):
        self.curr_patient = patient
        self.curr_patient.set_unavailable()
        self.finish_time = finish_time

    def clear_patient(self):

        patient = self.curr_patient
        patient.set_available()
        self.curr_patient = None
        self.finish_time = None

        return patient

    def is_available(self):
        return self.curr_patient  is None

    def get_id(self):
        return self.id
    
    def get_curr_patient(self):
        return self.curr_patient

    def get_finish_time(self):
        return self.finish_time
    