class Node():

    def __init__(self, id=None, process_name=None, distribution=None, distribution_parameters=None, num_actors=None,
                 queue_type=None,priority_function=None,output_proceses=None):
        self.id = id
        self.process_name = process_name
        self.distribution = distribution
        self.distribution_parameters = distribution_parameters
        self.num_actors = num_actors
        self.queue_type = queue_type
        self.priority_function = priority_function
        self.output_processes = output_proceses

    def set_id(self, id):
        self.id = id

    def set_process_name(self, process_name):
        self.process_name = process_name

    def set_distribution(self, distribution, distribution_parameters):
        self.distribution = distribution
        self.distribution_parameters = distribution_parameters

    def set_num_actors(self, num_actors):
        self.num_actors = num_actors

    def set_queue_type(self, queue_type, priority_function=None):
        self.queue_type = queue_type
        self.priority_function = priority_function

    def set_output_process(self, output_process):
        self.output_processes = output_process

    def get_id(self):
        return self.id

    def get_process_name(self):
        return self.process_name

    def get_distribution(self):
        return self.distribution

    def get_distribution_parameters(self):
        return self.distribution_parameters

    def get_num_actors(self):
        return self.num_actors

    def get_queue_type(self):
        return self.queue_type

    def get_priority_function(self):
        return self.priority_function

    def get_output_processes(self):
        return self.output_processes
