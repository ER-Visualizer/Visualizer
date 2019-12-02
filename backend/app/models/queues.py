from flask import Flask

app = Flask(__name__)

import logging


try:
    from collections.abc import deque  # noqa
except ImportError:
    from collections import deque
import heapq

'''
Need to make custom queues because we often need to iterate through
entire queue struc in order of queue datatype,
and then extract an element at that point,
without changing anything else. None of default structures offer that.
Additionally, we use dequeue, rather than Python's built-in Queue() because
it is not thread-safe which gives it a performance increase.
 
In order to iterate through the data types, need to implement custom
iterators for each one
'''



class Queue(): 

    def __init__(self):
        self.q = deque()
        self.contents = []

    def put(self, el):
        self.q.append(el)
        self.contents.append(el.get_id())

    def get(self):
        return self.q.popleft()

    def remove(self, val):
        return self.q.remove(val)

    def __iter__(self):
        self.iter = iter(self.q)
        return self.iter

    def __next__(self):
        return next(self.iter)


class Stack(Queue):

    def __init__(self):
        super().__init__()

    def put(self, el):
        self.q.appendleft(el)


class Heap:

    def __init__(self, priority_type, priority_function, l=[]):
        # convert input list into heap
        l = l[:]
        heapq.heapify(l)
        # assign q into heap
        self.q = l
        # assign priority type
        self.p_type = priority_type
        # assign priority function
        self.p_func = priority_function
        # if priority is custom then parse the input code
        if self.p_type == "custom":
            self._parse_p_func()

    def _parse_p_func(self):
        """
        Helper function to help fix spacing and remove empty lines
        Assign self.p_func to be the parse string
        """
        split = self.p_func.split("\n")
        new_split = []
        for line in split:
            line = line.strip()
            if line:
                new_split.append(line + "\n")
        self.p_func = "".join(new_split)
        app.logger.info("parsed p func")
        app.logger.info(self.p_func)

    def _calculate_priority_value(self, patient):
        """
        Returns the patient priority value (lower value is higher priority)
        :param patient: Input patient to calculate priority of
        :return: The priority value of the input patient
        """
        if self.p_type == "acuity":
            app.logger.info("p_type acuity")
            return patient.get_acuity()
        elif self.p_type == "arrival time":
            app.logger.info("p_type arrival type")
            return patient.get_start_time()
        elif self.p_type == "custom":
            app.logger.info("p_type custom")
            _p_value = 0
            l = locals()
            # executes input code string
            # need to pass in locals and globals to mutate _p_value
            exec(self.p_func, globals(), l)
            app.logger.info(l['_p_value'])
            return l['_p_value']

    def put(self, el):
        """
        Put patient into the heap based on its priority
        :param el: The patient to add
        """
        p_val = self._calculate_priority_value(el)
        # adds patients to min heap by priority
        heapq.heappush(self.q, (p_val, el))

    def get(self):
        """
        Get top patient from the heap
        :return: Highest priority patient
        """
        # return element 1 since element 0 is the priority value
        return heapq.heappop(self.q)[1]

    def iter_priority_queue(self):
        """
        Iterator for min heap
        """
        if len(self.q) == 0:
            return
        next_indices = [0]
        while next_indices:
            min_index = min(next_indices, key=self.q.__getitem__)
            # create generator
            yield self.q[min_index][1]
            next_indices.remove(min_index)
            # get next smallest elements
            if 2 * min_index + 1 < len(self.q):
                next_indices.append(2 * min_index + 1)
            if 2 * min_index + 2 < len(self.q):
                next_indices.append(2 * min_index + 2)

    def __iter__(self):
        self.iter = self.iter_priority_queue()
        return self.iter

    def __next__(self):
        return next(self.iter)

    def remove(self, val):
        """
        Remove patient from min heap
        :param val: patient to remove
        """
        index = 0
        while index < len(self.q):
            patient = self.q[index][1]
            if patient == val:
                self.q.pop(index)
                break
            index += 1
        # heapify queue again
        heapq.heapify(self.q)
        return




if __name__ == "__main__":
    q = Queue()
    app.logger.info(isinstance(q, Heap))
    app.logger.info(isinstance(q, Stack))
    app.logger.info(isinstance(q, Queue))
