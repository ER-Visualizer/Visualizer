class Event():
    def __init__(self, event_time, node_id, node_resource):
        self.event_time = event_time
        self.node_id = node_id
        self.node_resource = node_resource

    def __lt__(self, other):
        return self.event_time < other.event_time
