import queue
import numpy as np
from backend.app.models import global_strings


class Node():
    # This is a static variable which all Node classes share, as it doesn't need to be changed
    # All of the distributions here are distributions available in the numpy.random package
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
        global_strings.ZIPF: np.random.zipf
    }

    def __init__(self, id=None, process_name=None, distribution_name=None, distribution_parameters=None, num_actors=None,
                 queue_type=None, priority_function=None, output_process_ids=None):
        self.id = id
        self.process_name = process_name
        self.distribution_name = distribution_name
        self.distribution_parameters = distribution_parameters
        self.num_actors = num_actors
        self.queue_type = queue_type
        self.priority_function = priority_function
        self.output_process_ids = output_process_ids
        self.queue = self._set_queue()
        self.resource_dict = self._create_resource_dict()

    def set_id(self, id):
        self.id = id

    def set_process_name(self, process_name):
        self.process_name = process_name

    def set_distribution(self, distribution_name, distribution_parameters):
        self.distribution_name = distribution_name
        self.distribution_parameters = distribution_parameters

    def set_num_actors(self, num_actors):
        self.num_actors = num_actors

    def set_queue_type(self, queue_type, priority_function=None):
        self.queue_type = queue_type
        self.priority_function = priority_function

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

    def set_queue(self):
        # TODO: These are all synchronous, thread-safe. Which slows everything down.
        #  Can and should we make them non-safe?
        if self.get_queue_type() == global_strings.STACK:
            return queue.LifoQueue()
        elif self.get_queue_type() == global_strings.QUEUE:
            return queue.Queue()
        elif self.get_queue_type() == global_strings.PRIORITY_QUEUE:
            return queue.PriorityQueue()
        else:
            raise Exception("This type of queue is not implemented yet")

    def get_distribution_sample(self):

        return Node.class_distributions[self.get_distribution_name()](self.get_distribution_parameters())

    '''
    This is the dict of all the subprocesses/resource a node has, with key as unique id.
    If a node has 3 actors, will have 3 resources/subprocesses.
    If a node only has 1 actor or one resources, then only create 1 resource/subprocess
    '''

    def _create_resource_dict(self):

        raise Exception("Not implemented yet")

    '''
    Occurs whenever the minimum element from the heap is extracted, which means that the patient has finished a process
    '''

    def handle_finished_patient(self, resource_id):

        resource = self.resource_dict[resource_id]

        # get the patient out of the subprocess. this automatically sets him to available
        patient = resource.clear_patient()

        # TODO make sure patient instance is set to available after this
        # TODO see if we need to do this in random order to avoid bias. Might have to, b/c if  spot is available,
        #  patient will take that first available spot, so might have a case where patient always fills the first spot

        # first send the patient to all of the queues that they need to be put in (outgoing processes from
        # parent_process)
        for process_id in self.output_process_ids:
            Node.processDict[process_id].put_patient_in_queue(patient)

        # call fill_spot on this subprocess because now we have an empty spot there
        self.fill_spot_for_resource(resource)

    '''
    Called when a patient finishes some other process, and is sent to wait in a queue for this current process
    '''

    def put_patient_in_queue(self, patient):

        # Try to place patient directly into a resource, if available. If patient couldn't fit, place him inside queue
        if not self.fill_spot(patient):
            # Push Patient inside queue
            self.queue.put(patient)

    # when called from a subprocess, this means that the subprocess just handled a patient, and needs a new one
    # so fill his spot, and return true if you can
    def fill_spot_for_resource(self, subprocess):

        # iterate through the queue in the RIGHT ORDER.
        # 1. Check if patient is available
        # 2. If yes, check if patient passes rule
        # If yes, extract it from the queue
        # Insert it into the resource/subprocess(existing method)
        # Add element on the heap(existing method)
        raise Exception("Not implemented yet")

    '''
    Try to insert a patient into an available resource, if there exists one.
    Return true if patient inserted successfully.
    
    Will be false only if:
        - All resources are currently occupied
        - Doesn't pass the rule for any of the available resources
            - If a resource is available, then we know that
                - either queue is empty
                - none of the elements in the queue passed the rule for this resource, so then try the current patient
                    to see if he passes
    Will be true if:
        - There is a resource in the process that is available, and patient passes the rule for a specific resource
    '''

    def fill_spot(self, patient):

        # 1. Check: Is patient busy? If no, proceed
        if patient.is_available():
            # iterate through all resource(possibly random order) and check
            # 1. Is resource available
            # 2. If it's available, does this element pass the resource rule
            # 3. If yes, insert the patient into the specific resource(existing method
            # 4. Add the element on the heap
            pass

        raise Exception("Not implemented yet")

    def add_to_the_heap(self):

        raise Exception("Not implemented yet")
