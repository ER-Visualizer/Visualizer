class NodeAccessInfo():
    #TODO change API from curr to normal(get resource_id, get process_id
    def __init__(self, curr_process_id=None, curr_resource_id=None,
                 start_time=None, end_time=None):

        self.curr_process_id = curr_process_id
        self.curr_resource_id = curr_resource_id
        self.curr_resource_start_time = start_time
        self.curr_resource_end_time = end_time

    def get_curr_process_id(self):
        return self.curr_process_id

    def set_curr_process_id(self, process_id):
        self.curr_process_id = process_id

    def get_curr_resource_id(self):
        return self.curr_resource_id

    def set_curr_resource_id(self, resource_id):
        self.curr_resource_id = resource_id

    def get_curr_resource_start_time(self):
        return self.curr_resource_start_time

    def set_curr_resource_start_time(self, start_time):
        self.curr_resource_start_time = start_time

    def get_curr_resource_end_time(self):
        return self.curr_resource_end_time

    def set_curr_resource_end_time(self, end_time):
        self.curr_resource_end_time = end_time
