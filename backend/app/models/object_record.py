from .node_access_info import NodeAccessInfo

#TODO decide whether to alter it from node.py or from patient
class ObjectRecord():

    def __init__(self, object_id, start_time):
        self.object_id = object_id
        # old_active_queues are queues that the patient is still in that were not added RECENTLy
        # recently: since the last finished process. We have a separate list which contains those
        # queues(queues_since_last_finished_process), as we want to report that specific list to the front-end.
        # you can get each of the separate lists of queues, are ALL queues by calling get_all_queues()
        # Fundamental assumption about the lists: A patient can be in the same queue many times, but only once at a time,
        # i.e if i look inside the active list of queues for a patient, will not have any repeats.
        self.old_active_queues = []
        # new_queues is a list of the queues a patient is added to in a current round
        self.queues_since_last_finished_process = []
        # represents the processes it has been through so far
        self.visited = []
        # represents the process it is currently in
        self.curr_node = None
        self.start_time = start_time

    def get_id(self):
        return self.object_id
    
    def get_last_visited_node_id(self):
        if len(self.visited) == 0:
            return None
        else:
            return self.visited[-1].get_curr_process_id()

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

    def get_visited(self):
        return self.visited

    def get_all_queues(self):
        return self.old_active_queues + self.queues_since_last_finished_process
    
    def get_old_queues(self):
        return self.old_active_queues

    def get_queues_since_last_finished_process(self):
        return self.queues_since_last_finished_process

    def put_process_in_queue(self,process_id):
        self.queues_since_last_finished_process.append(process_id)

    def remove_process_from_queue(self,process_id):
        if process_id in self.queues_since_last_finished_process:
            self.queues_since_last_finished_process.remove(process_id)
        else:
            self.old_active_queues.remove(process_id)
    '''queues are cleared whenever a patient finishes the current process'''
    def clear_queues_since_last_finished_process(self):
        self.old_active_queues += self.queues_since_last_finished_process
        self.queues_since_last_finished_process = []

    def set_curr_node(self,curr_process_id,curr_resource_id,start_time,end_time):
        self.curr_node = NodeAccessInfo(curr_process_id,curr_resource_id,start_time,end_time)

    '''current node becomes empty when a process is finished. It is then archived into list of visited nodes.'''
    def clear_and_store_curr_node(self):
        # clear the current node
        if self.curr_node != None:
            self.visited.append(self.curr_node)
        self.curr_node = None

    def get_curr_duration(self):
        return self.curr_node.get_curr_resource_end_time() - \
            self.curr_node.get_curr_resource_start_time()

    def get_end_time_of_last_process(self):
        # handles case where there is no previously processed node (when patient is in patient_loader)
        if len(self.visited) == 0:
            return 0
        # go into the last visited node, and get the finish time
        return self.visited[-1].get_curr_resource_end_time()

