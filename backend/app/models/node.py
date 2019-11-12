from app.models.queues import Queue, Stack, Heap
import app.models.global_strings as global_strings
from app.models.resource import Resource
from app.models.event import Event
from app.models.test_distrib import test_distribution
from app.models.global_time import GlobalTime
from app.models.global_heap import GlobalHeap
import copy
import heapq
import numpy as np


class Node():

    # This is a static variable which all Node classes share, as it doesn't need
    # to be changed. All of the distributions here are distributions available
    # in the numpy.random package
    class_distributions = {
        global_strings.BETA: np.random.beta,
        global_strings.BINOMIAL: np.random.binomial,
        global_strings.CHISQUARE: np.random.chisquare,
        global_strings.DIRICHLET: np.random.dirichlet,
        global_strings.EXPONENTIAL: np.random.exponential,
        global_strings.F: np.random.f,
        global_strings.GAMMA: np.random.gamma,
        global_strings.GEOMETRIC: np.random.geometric,
        global_strings.GUMBEL: np.random.gumbel,
        global_strings.HYPERGEOMETRIC: np.random.hypergeometric,
        global_strings.LAPLACE: np.random.laplace,
        global_strings.LOGISTIC: np.random.logistic,
        global_strings.LOGNORMAL: np.random.lognormal,
        global_strings.LOGSERIES: np.random.logseries,
        global_strings.MULTINOMIAL: np.random.multinomial,
        global_strings.MULTIVARIATE_NORMAL: np.random.multivariate_normal,
        global_strings.NEGATIVE_BINOMIAL: np.random.negative_binomial,
        global_strings.NONCENTRAL_CHISQUARE: np.random.noncentral_chisquare,
        global_strings.NONCENTRAL_F: np.random.noncentral_f,
        global_strings.NORMAL: np.random.normal,
        global_strings.PARETO: np.random.pareto,
        global_strings.POISSON: np.random.poisson,
        global_strings.POWER: np.random.power,
        global_strings.RAYLEIGH: np.random.rayleigh,
        global_strings.STANDARD_CAUCHY: np.random.standard_cauchy,
        global_strings.STANDARD_EXPONENTIAL: np.random.standard_exponential,
        global_strings.STANDARD_GAMMA: np.random.standard_gamma,
        global_strings.STANDARD_NORMAL: np.random.standard_normal,
        global_strings.STANDARD_T: np.random.standard_t,
        global_strings.TRIANGULAR: np.random.triangular,
        global_strings.UNIFORM: np.random.uniform,
        global_strings.VONMISSES: np.random.vonmises,
        global_strings.WALD: np.random.wald,
        global_strings.WEIBULL: np.random.weibull,
        global_strings.ZIPF: np.random.zipf,
        global_strings.TEST: test_distribution
    }
    node_dict = {}

    def __init__(self, id, queue_type, priority_function, num_actors,
                 process_name=None, distribution_name=None,
                 distribution_parameters=None, output_process_ids=None):

        self.id = id
        # create the queue type, prior func and the queue itself
        self.queue_type = queue_type

        if(priority_function == ""):
            self.priority_function = None
        else:
            self.priority_function = priority_function
        self.queue = self._set_queue()

        # create num actors and resource dict based on num actors
        self.num_actors = num_actors
        self.resource_dict = self._create_resource_dict()

        self.process_name = process_name
        self.distribution_name = distribution_name
        self.distribution_parameters = distribution_parameters
        self.output_process_ids = output_process_ids

        Node.node_dict[self.id] = self

    def set_id(self, id):
        self.id = id

    def set_process_name(self, process_name):
        self.process_name = process_name

    def set_distribution(self, distribution_name, distribution_parameters):
        self.distribution_name = distribution_name
        self.distribution_parameters = distribution_parameters

    # TODO see if i can remove it
    ''' Set number of actors and create the dictionary of resources,
    1 for each actor'''

    def set_num_actors(self, num_actors):
        self.num_actors = num_actors
        self.resource_dict = self._create_resource_dict()

    def set_output_process_ids(self, output_process_ids):
        self.output_processes_ids = output_process_ids

    def get_id(self):
        return self.id

    def get_process_name(self):
        return self.process_name

    def get_distribution_name(self):
        return self.distribution_name

    def get_distribution_parameters(self):
        return self.distribution_parameters

    def get_num_actors(self):
        return self.num_actors

    def get_queue_type(self):
        return self.queue_type

    def get_priority_function(self):
        return self.priority_function

    def get_output_process_ids(self):
        return self.output_processes_ids

    # TODO See if I can remove it
    '''Set the queue type, priority function,
    and then create the actual queue'''

    def set_queue_type(self, queue_type, priority_function=None):
        self.queue_type = queue_type
        self.priority_function = priority_function
        self.queue = self._set_queue()

    def _set_queue(self):
        # TODO Deal with Priority Queues
        # Note. All of these are not thread-safe, so can't use threads on them
        if self.queue_type == global_strings.STACK:
            return Stack()
        elif self.queue_type == global_strings.QUEUE:
            return Queue()
        elif self.queue_type == global_strings.PRIORITY_QUEUE:
            return Heap()
        else:
            raise Exception("This type of queue is not implemented yet")

    def generate_finish_time(self):

        duration = Node.class_distributions[self.get_distribution_name()](
            self.get_distribution_parameters())
        finish_time = GlobalTime.time + duration
        return finish_time

    '''
    This is the dict of all the subprocesses/resource a
    node has, with key as unique id.
    If a node has 3 actors, will have 3 resources/subprocesses.
    If a node only has 1 actor or one resources, then
    only create 1 resource/subprocess
    '''

    def _create_resource_dict(self):

        resource_dict = {}

        for i in range(self.num_actors):
            new_resource = Resource(id=i)
            resource_dict[i] = new_resource
        return resource_dict

    '''
    Occurs whenever the minimum element from the heap is extracted, which
    means that the patient has finished a process
    '''

    def handle_finished_patient(self, resource_id):

        resource = self.resource_dict[resource_id]

        # get the patient out of the subprocess. this
        # automatically sets him to available
        patient = resource.clear_patient()

        # TODO see if we need to do this in random order to avoid bias.
        # Might have to, b/c if  spot is available,
        #  patient will take that first available spot, so might
        # have a case where patient always fills the first spot

        # first send the patient to all of the queues that they need
        # to be put in (outgoing processes from
        # parent_process)
        for process_id in self.output_process_ids:
            Node.node_dict[process_id].put_patient_in_queue(patient)

        # call fill_spot on this subprocess because now we have an empty spot there
        self.fill_spot_for_resource(resource)

    '''
    Called when a patient finishes some other process, and is sent to
    wait in a queue for this current process
    '''

    def put_patient_in_queue(self, patient):

        # Try to place patient directly into a resource, if available.
        # If patient couldn't fit, place him inside queue
        if not self.fill_spot(patient):
            # Push Patient inside queue
            self.queue.put(patient)

    # when called from a subprocess, this means that the subprocess just
    # handled a patient, and needs a new one
    # so fill his spot, and return true if you can
    def fill_spot_for_resource(self, subprocess):

        # iterate through the queue in the RIGHT ORDER.
        # 1. Check if patient is available
        # 2. If yes, check if patient passes rule
        # If yes, extract it from the queue
        # Insert it into the resource/subprocess(existing method)
        # Add element on the heap(existing method)

        # TODO: test if for different types of queues,
        # this iterates in the right orders
        # This will iterate through stacks and queues in the right order

        # If it's a heap, we need to iterate through a copy of the heap,
        # as the iterator will mutate the heap list. Therefore, we need to create a deep
        # copy of the list for the new Heap() to mutate. When we remove
        # from the heap, we need to remove from the actual heap,
        # and we'll use the index because we can't remove by Patient as it's a
        # deep copy so we don't have a hold of actual memory address.
        # TODO test case: make sure heap isn't changed
        # TODO make sure iterates correctly through heap
        if(isinstance(self.queue, Heap)):

            # need to make sure we iterate through the copy of the heap
            heap_list = copy.deepcopy(self.queue.q)
            # create a mapping of the indeces to the values. original queue
            # will have an identical mapping.
            # TODO check if it maps correctly
            indices_to_patients = {k: v for v, k in enumerate(heap_list)}
            iterator = Heap(heap_list)

        else:
            iterator = self.queue

        for patient in iterator:
            if patient.is_available():
                if subprocess.pass_rule(patient):
                    # remove from queue
                    if(isinstance(self.queue, Heap)):
                        # get the index of the patient to remove
                        index_to_remove = indices_to_patients[patient]
                        # return the original patient, not the one from the copy of the queue
                        patient = self.queue.remove_by_index(index_to_remove)
                    else:
                        # extract from the queue. no need to store him, as we
                        # already have a hold of him
                        self.queue.remove(patient)

                    self.insert_patient_to_resource_and_heap(
                        patient, subprocess)
                    return True

        return False

    '''
    Try to insert a patient into an available resource, if there exists one.
    Return true if patient inserted successfully.
    
    Will be false only if:
        - All resources are currently occupied
        - Doesn't pass the rule for any of the available resources
            - If a resource is available, then we know that
                - either queue is empty
                - none of the elements in the queue passed the rule for this
                resource, so then try the current patient
                    to see if he passes
    Will be true if:
        - Patient is available, and there is a resource in the process
        that is available,and patient passes the rule for a specific resource
    '''

    def fill_spot(self, patient):
        # TODO: consider random order
        # 1. Check: Is patient busy? If no, proceed
        if patient.is_available():
            # iterate through all resource(possibly random order) and check
            # 1. Is resource available
            # 2. If it's available, does this element pass the resource rule
            # 3. If yes, insert the patient into
            # the specific resource(existing method
            # 4. Add the element on the heap
            for resource in self.resource_dict.values():
                if resource.is_available():
                    if resource.pass_rule(patient):
                        self.insert_patient_to_resource_and_heap(
                            patient, resource)
                        return True
        return False

    def insert_patient_to_resource_and_heap(self, patient, resource):
        # insert patient into resource, since it's free
        time = self.generate_finish_time()
        resource.insert_patient(patient, time)

        self.add_to_heap(resource.get_id())

    '''A resource has just been filled with a patient.
    Get its event, and add it to the heap'''

    def add_to_heap(self, resource_id):
        resource = self.resource_dict[resource_id]
        event = Event(resource.get_finish_time(), self.id,  resource_id)
        # heap = run.get_heap()
        heapq.heappush(GlobalHeap.heap, event)
