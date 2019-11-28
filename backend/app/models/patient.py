from .object_record import ObjectRecord
from .global_time import  GlobalTime
from .global_strings import *
class Patient:

    '''properties is a dictionary which contains all of the'''
    def __init__(self, properties):
        self.properties = properties
        self.is_available = True
        self.patient_record = ObjectRecord(self.properties[ID], self.properties[START_TIME])

    ''' For use in comparison inside heaps. We will need to overwrite this
    with a priority function given to us from canvas'''

    def __lt__(self, other):
        return self.get_acuity() < other.get_acuity()

    def get_id(self):
        return self.properties[ID]
    
    def get_acuity(self):
        return int(self.properties[ACUITY])

    def set_acuity(self, acuity):
        self.properties[ACUITY] = acuity
    
    def get_start_time(self):
        return int(self.properties[START_TIME])

    def get_available(self):
        return self.is_available
    
    def get_attribute(self, attribute):
        return self.properties[attribute]
    
    def set_attribute(self, attribute, value):
        self.properties[attribute] = value

    #TODO consider whether to move setting properties for the patient_record inside the Node Class.
    '''patient must be set unavailable right after he entered a new process'''
    def set_unavailable(self, node_id, resource_id, finish_time):
        self.is_available = False
        # add curr node to patient record
        self.patient_record.set_curr_node(node_id, resource_id, GlobalTime.time, finish_time)

    '''patient must be set available right after he finished a process'''
    def set_available(self):
        self.is_available = True
        # clear current node as patient is not in any current node anymore
        self.patient_record.clear_and_store_curr_node()
        # since patient is now available,i.e just finished process, so he will
        # be sent to new nodes(whether in queues or in actual resources)
        self.patient_record.clear_queues_since_last_finished_process()

    def get_patient_record(self):
        return self.patient_record
