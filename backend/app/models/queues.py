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

    # TODO test them out, by creating a Queue, see if you can iterate thru
    # all of it
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


# patient = None

class Heap():

    # TODO: We are heapifying an already existing heap. What is time complexity on that?
    # IF bigger than O(1), just set it directly. Maybe implement a flag
    def __init__(self, priority_type, priority_function, l=[]):
        l = l[:]
        heapq.heapify(l)
        self.q = l
        self.p_type = priority_type
        self.p_func = priority_function
        self._return_line = ""
        if self.p_type == "custom":
            self._parse_p_func()

    def _parse_p_func(self):
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
            exec(self.p_func, globals(), l)
            app.logger.info(l['_p_value'])
            return l['_p_value']

    def put(self, el):
        # global patient
        # patient = el
        p_val = self._calculate_priority_value(el)
        heapq.heappush(self.q, (p_val, el))

    def get(self):
        return heapq.heappop(self.q)[1]

    def iter_priority_queue(self):
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
        index = 0
        while index < len(self.q):
            patient = self.q[index][1]
            if patient == val:
                self.q.pop(index)
                break
            index += 1
        heapq.heapify(self.q)
        return


def test_remove_from_heap():
    el = Heap()
    el.put(3)
    el.put(4)
    el.put(5)
    el.put(6)
    el.put(120)
    el.put(1)

    app.logger.info(el.q)
    app.logger.info(el.remove(120))
    app.logger.info(el.q)
    app.logger.info(el.remove_by_index(2))
    app.logger.info(el.q)


if __name__ == "__main__":
    q = Queue()
    app.logger.info(isinstance(q, Heap))
    app.logger.info(isinstance(q, Stack))
    app.logger.info(isinstance(q, Queue))
    test_remove_from_heap()
