"""
{ Events: 
    [ 
      { patientId: patient{id}, 
        movedTo: queue{id}, 
        startedAt:  queue{id}, 
        timeStamp: “”
      }
    ]
}
"""

class Event():
    # def __init__(self, event_time, node_id, node_resource):
    #     self.event_time = event_time
    #     self.node_id = node_id
    #     self.node_resource = node_resources

    def __init__(self, node_id, node_resource_id,  patient_id, event_time):
        self.patient_id = patient_id
        # when the event finishes
        self.event_time = event_time
        self.node_id = node_id
        self.node_resource_id = node_resource_id
        self.moved_to = None
        self.in_queue = True
        self.finished = False

    def __lt__(self, other):
        return self.event_time < other.event_time

    def get_patient_id(self):
        return self.patient_id

    def get_finished(self):
        return self.finished

    def get_event_time(self):
        return self.event_time

    def get_node_id(self):
        return self.node_id

    def get_node_resource_id(self):
        return self.node_resource_id

    def get_in_queue(self):
        return self.in_queue

    def set_moved_to(self, node_ids):
        self.moved_to = node_ids

    def set_in_queue(self, in_queue):
        self.in_queue = in_queue

    def set_finished(self):
        self.finished = True

    def get_moved_to(self):
        return self.moved_to
