class Node():

    def __init__(self):
        self.id = None;
        self.process_name = None
        self.distribution = None
        self.distribution_parameters = None
        self.num_actors = None
        self.queue_type = None
        self.priority_function = None
        self.output_processes  = None

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

