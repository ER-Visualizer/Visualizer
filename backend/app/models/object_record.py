from .node_access_info import NodeAccessInfo

class ObjectRecord():

    def __init__(self, object_id):
        self.object_id = object_id
        # Represents the processes that it will visit,
        # and it's now waiting for
        self.curr_queues = []
        # represents the processes it has been through so far
        self.visited = []
        # represents the process it is currently in
        self.curr_node = None

    def get_id(self):
        return self.object_id

    def get_curr_process_id(self):
        if(self.curr_node != None):
            return self.curr_node.get_curr_process_id()
        return None

    def get_curr_resource_id(self):
        if(self.curr_node != None):
            return self.curr_node.get_curr_resource_id()
        return None

    def get_curr_resource_start_time(self):
        if(self.curr_node != None):
            return self.curr_node.get_curr_resource_start_time()
        return None

    def get_curr_resource_end_time(self):
        if(self.curr_node != None):
            return self.curr_node.get_curr_resource_end_time()
        return None

    def get_curr_queues(self):
        return self.curr_queues

    def get_visited(self):
        return self.visited
    
    def set_curr_node(self,curr_process_id,curr_resource_id,start_time,end_time):
        node_access_info = NodeAccessInfo(curr_process_id,curr_resource_id,
        start_time,end_time)
        if self.curr_node != None:
            self.visited.append(self.curr_node)
        self.curr_node = node_access_info
    
    def put_process_in_queue(self,process_id):
        self.curr_queues.append(process_id)

    def remove_process_from_queue(self,process_id):
        self.curr_queues.remove(process_id)
