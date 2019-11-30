from .queues import Queue, Stack, Heap
from .global_strings import *
from .distributions import Distributions
from .resource import Resource
from .event import Event
from .global_time import GlobalTime
from .global_heap import GlobalHeap
from .global_events import GlobalEvents
import heapq
from flask import Flask
import os
import random

app = Flask(__name__)


class Node:

    node_dict = {}
    environment = os.environ.get("DEV_ENV")
    '''rules is a list of Rule Objects'''
    def __init__(self, id, queue_type, priority_function, num_actors,
                 process_name=None, distribution_name=None,
                 distribution_parameters=None, output_process_ids=None, rules=[], priority_type=""):

        self.id = int(id)
        # create the queue type, prior func and the queue itself
        self.queue_type = queue_type

        if priority_function == "":
            self.priority_function = None
        else:
            self.priority_function = priority_function
        if priority_type == "":
            self.priority_type = None
        else:
            self.priority_type = priority_type
        self.queue = self._set_queue()

        # create num actors and resource dict based on num actors
        self.num_actors = int(num_actors)
        self.resource_dict = self._create_resource_dict()

        self.process_name = process_name
        self.distribution_name = distribution_name
        self.distribution_parameters = distribution_parameters
        self.output_process_ids = output_process_ids

        Node.node_dict[self.id] = self
        self.rules = rules[:]

    def set_id(self, id):
        self.id = id

    def set_process_name(self, process_name):
        self.process_name = process_name

    def set_distribution(self, distribution_name, distribution_parameters):
        self.distribution_name = distribution_name
        self.distribution_parameters = distribution_parameters

    def set_output_process_ids(self, output_process_ids):
        self.output_processes_ids = output_process_ids
    
    def set_rules(self,rules):
        self.rules = rules

    def get_rules(self, rules):
        return self.rules

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
        if resource_id in self.resource_dict:
            return self.resource_dict[resource_id]
        return None

    def get_priority_type(self):
        return self.priority_type

    def _set_queue(self):
        # TODO Deal with Priority Queues
        # Note. All of these are not thread-safe, so can't use threads on them
        if self.queue_type == STACK:
            return Stack()
        elif self.queue_type == QUEUE:
            return Queue()
        elif self.queue_type == PRIORITY_QUEUE:
            return Heap(self.get_priority_type(), self.get_priority_function())
        else:
            raise Exception("This type of queue is not implemented yet")

    def generate_finish_time(self):
        if self.get_distribution_name() is None: 
            duration = 0
        else:
            duration = Distributions.class_distributions[self.get_distribution_name()](
                *self.get_distribution_parameters())
        finish_time = GlobalTime.time + int(duration)
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
    '''check if the patient passes all of the rules in order to see whether
    patient is eligible to visit'''
    def pass_node_rules(self, patient):
        passes_rule = True
        counter = 0
        while passes_rule and counter < len(self.rules):
            rule = self.rules[counter]
            passes_rule = rule.check(patient)
            counter += 1
        return passes_rule

    '''
    Occurs whenever the minimum element from the heap is extracted, which
    means that the patient has finished a process
    '''

    def handle_finished_patient(self, resource_id):
        resource = self.resource_dict[resource_id]
        # get the patient out of the subprocess. this
        # automatically sets him to available
        old_id = ((resource.get_curr_patient()).get_patient_record()).get_curr_process_id()
        patient = resource.clear_patient()
        app.logger.info("patient {} finished {}(id:{}), resource {}".format(patient.get_id(),\
            self.get_process_name(), self.get_id(), resource.get_id()))
        self.add_patient_leave_resource_event(patient)

        # all_patient_queues are the list of processes for which the patient is in a queue, i.e [1,3,4]. 
        # we will attempt to insert him in any of the available resources into those processes, as this is the case when a 
        # resource became available while the patient was busy, but is now free.
        # patient_ougoing_processes are the list of processes that the patient must go to from this node i.e [2,1,5]
        # we will attempt to insert him in available resources for these processes, and if the patient is already
        # busy, or if all resources are busy, he will be queued for those processes instead.
        # simulate_concur_env() shuffles order if we're in production, otherwise keeps
        # it linear, through it(first through all_patient_queues and then through all_processes)
        all_patient_queues = [(k,0) for k in patient.get_patient_record().get_all_queues()]
        outgoing_processes = [(m,1) for m in self.output_process_ids]
        all_processes = all_patient_queues + outgoing_processes
        all_processes = self.simulate_concur_env(all_processes, Node.environment)
        app.logger.info("processes list is {}".format(all_processes))

        for (process_id, marker) in all_processes:
            # we stop trying to insert patient into processes from old queues, when he's
            # already been inserted. However, we don't stop if he's been inserted in an
            # outgoing process, because in that case, he still needs to be put in queues
            # for other processes
            if(marker == 0):
                Node.node_dict[process_id].fill_spot(patient)
            elif(marker == 1):
                Node.node_dict[process_id].put_patient_in_node(patient, old_id)
      
        # call fill_spot on this subprocess because now we have an empty spot
        # there and want to fill it with another patient
        self.fill_spot_for_resource(resource)
    '''
    Call when you're inserting into a node. This will check if patient is allowed into the node, and if it is,
    then will try to find an available spot, and if can't find one, will place him in a queueu
    '''

    def put_patient_in_node(self, patient, prev_node_id=None):
        # Try to place patient directly into a resource, if available.
        # If patient couldn't fit, place him inside queue

        # first check if it passes all of the rules for the patient
        # if it does, check if you can directly insert him into a resource
        # if you can't, insert him into a queue
        if self.pass_node_rules(patient):
            if not self.fill_spot(patient):
                self.put_inside_queue(patient, prev_node_id)

    def put_inside_queue(self, patient, prev_node_id=None):
        # Push Patient inside queue
        # only add if patient is not already in the queue
        if self.id not in patient.get_patient_record().get_all_queues():
            self.queue.put(patient)
            # TODO Consider whether it's good to move it inside the queue
            # put queue in patient record
            patient_record = patient.get_patient_record()
            patient_record.put_process_in_queue(self.id)
            self.add_patient_join_queue_event(patient, prev_node_id)
            app.logger.info("patient {} is added to queue of {}(id:{})".format(patient.get_id(), self.get_process_name(), self.id))
        else:
            app.logger.info("Attempted to Insert patient in same queue twice")


    # when called from a subprocess, this means that the subprocess justs
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
        iterator = self.queue
        for patient in iterator:
            if patient.get_available():
                if subprocess.is_available():
                    if subprocess.pass_rule(patient):
                        self.queue.remove(patient)

                        # once removed from queue, update patient record
                        patient_record = patient.get_patient_record()
                        patient_record.remove_process_from_queue(self.id)
                        self.insert_patient_to_resource_and_heap(
                            patient, subprocess)
                        return True

        return False

    def add_patient_leave_resource_event(self, patient):
        """
        Add the event of patient leaving a resource into global event_changes
        :param patient: Patient object of the patient thats is leaving a resource
        """
        leave_resource = Event(self.get_id(), 'N/A', patient.get_id(), GlobalTime.time)
        leave_resource.set_in_queue(False)
        leave_resource.set_finished()
        GlobalEvents.event_changes.append(leave_resource)

    def add_patient_join_resource_event(self, patient, resource):
        """
        Add the event of patient entering a resource into global event_changes
        :param patient: Patient object of the patient thats is entering a resource
        """
        leave_queue = Event(self.get_id(), resource.get_id(),
                            patient.get_id(), GlobalTime.time)
        leave_queue.set_in_queue(False)
        leave_queue.set_moved_to([self.get_id()])
        GlobalEvents.event_changes.append(leave_queue)

    def add_patient_join_queue_event(self, patient, old_id):
        """
        Add the event of patient joining a queue into global event_changes
        :param patient: Patient object of the patient thats is joining a queue
        """
        if old_id is None:
            return
        join_queue = Event(old_id, 'N/A', patient.get_id(), GlobalTime.time)
        patient_record = patient.patient_record
        join_queue.set_moved_to([self.get_id()])

        if patient_record.get_curr_process_id is not None:
            GlobalEvents.event_changes.append(join_queue)
    
    def simulate_concur_env(self, res_to_shuffle, environment):
        '''
        Shuffles order of resources/processes to go to if in production,
        otherwise returns them in the right order
        '''
        if environment == DEVELOPMENT:
            return res_to_shuffle
        elif environment == PRODUCTION:
            random.shuffle(res_to_shuffle)
            return res_to_shuffle


    def fill_spot(self, patient):
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

        # 1. Check: Is patient busy? If no, proceed
        if patient.get_available():
            # iterate through all resource and check
            # 1. Is resource available
            # 2. If it's available, does this element pass the resource rule
            # 3. If yes, insert the patient into
            # the specific resource(existing method
            # 4. Add the element on the heap
            resource_list = self.simulate_concur_env(self.resource_dict.values(),Node.environment)
            for resource in resource_list:
                if resource.is_available():
                    if resource.pass_rule(patient):
                        # if the patient is in the queue where you're trying to fill a spot, then remove him from the queue
                        # as you're visiting now. This makes sense because if he's inserted in the resource, you can
                        # consider that as him finishing the queue.
                        if patient in self.queue:
                            self.queue.remove(patient)

                            # once removed from queue, update patient record
                            patient_record = patient.get_patient_record()
                            patient_record.remove_process_from_queue(self.id)
                        # record event of patient joining resource
                        self.insert_patient_to_resource_and_heap(
                            patient, resource)
                        return True
        return False

    def insert_patient_to_resource_and_heap(self, patient, resource):
        # insert patient into resource, since it's available
        app.logger.info("patient {} is added to {}(id:{}), inside resource {}".format(patient.get_id(),\
            self.get_process_name(), self.get_id(), resource.get_id(),))
        # if resource is patient loader, set duration to be when the patient is supposed to join
        # reception
        if self.get_id() == -1:
            finish_time = patient.get_start_time()
            duration = finish_time - GlobalTime.time
        else:
            finish_time, duration = self.generate_finish_time()
        resource.insert_patient(patient, self.id, finish_time, duration)
        # record event of patient joining resource
        self.add_patient_join_resource_event(patient, resource)

        # now add the event to the heap
        self.add_to_heap(resource.get_id())

    '''A resource has just been filled with a patient.
    Get its event, and add it to the heap'''

    def add_to_heap(self, resource_id):
        resource = self.resource_dict[resource_id]
        event = Event(self.id, resource_id, resource.get_curr_patient().get_id(), resource.get_finish_time())
        heapq.heappush(GlobalHeap().heap, event)
