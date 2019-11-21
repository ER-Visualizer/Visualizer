from .queues import Queue, Stack, Heap
from .global_strings import *
from .distributions import Distributions
from .resource import Resource
from .event import Event
from .global_time import GlobalTime
from .global_heap import GlobalHeap
import copy
import heapq
import numpy as np


class Node:

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
        return self.output_process_ids

    def get_resource(self, resource_id):
        return self.resource_dict[resource_id]

    def _set_queue(self):
        # TODO Deal with Priority Queues
        # Note. All of these are not thread-safe, so can't use threads on them
        if self.queue_type == STACK:
            return Stack()
        elif self.queue_type == QUEUE:
            return Queue()
        elif self.queue_type == PRIORITY_QUEUE:
            return Heap()
        else:
            raise Exception("This type of queue is not implemented yet")

    def generate_finish_time(self):
        if self.get_distribution_name() is None: 
            duration = 0
        else:
            duration = Distributions.class_distributions[self.get_distribution_name()](
                *self.get_distribution_parameters())
        finish_time = GlobalTime.time + duration
        return finish_time, duration

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
            Node.node_dict[process_id].put_patient_in_node(patient)

        # call fill_spot on this subprocess because now we have an empty spot there
        self.fill_spot_for_resource(resource)

    '''
    Called when a patient finishes some other process, and is sent to
    wait in a queue for this current process
    '''

    def put_patient_in_node(self, patient):

        # Try to place patient directly into a resource, if available.
        # If patient couldn't fit, place him inside queue
        if not self.fill_spot(patient):
            # Push Patient inside queue
            self.queue.put(patient)

            # put queue in patient record
            patient_record = patient.get_patient_record()
            patient_record.put_process_in_queue(self.id)

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
            if patient.get_available():
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
                    
                    # once removed from queue, update patient record
                    patient_record = patient.get_patient_record()
                    patient_record.remove_process_from_queue(self.id)

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
        if patient.get_available():
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
        # insert patient into resource, since it's available
        finish_time, duration = self.generate_finish_time()
        resource.insert_patient(patient, finish_time, duration)
        
        # add curr node to patient record
        patient_record = patient.get_patient_record()
        patient_record.set_curr_node(self.id, resource.get_id(), GlobalTime.time, finish_time)

        # now add the event to the heap
        self.add_to_heap(resource.get_id())

    '''A resource has just been filled with a patient.
    Get its event, and add it to the heap'''

    def add_to_heap(self, resource_id):
        resource = self.resource_dict[resource_id]
        event = Event(self.id, resource_id, resource.get_curr_patient().get_id(), resource.get_finish_time())
        # heap = run.get_heap()

        heapq.heappush(GlobalHeap().heap, event)
