from collections import deque
import heapq

'''
Need to make custom queues because we often need to iterate through
entire queue struc in order of queue datatype,
and then extract an element at that point,
without changing anything else. None of default structures offer that.
Additionally, we use dequeue, rather than Python's built-in Queue() because
it is not thread-safe which gives it a performance increase
'''


class Queue():

    def __init__(self):
        self.q = deque()

    def put(self, el):
        self.q.append(el)

    def get(self):
        return self.q.popleft()

    def remove(self, val):
        return self.remove(val)


class Stack():

    def __init__(self):
        self.q = deque()

    def put(self, el):
        self.q.appendleft(el)

    def get(self):
        return self.q.popleft()

    def remove(self, val):
        return self.remove(val)


class Heap():

    def __init__(self):
        self.q = []

    def put(self, el):
        heapq.heappush(self.q, el)

    def get(self):

        return heapq.heappop(self.q)

    # https://stackoverflow.com/questions/10162679/python-delete-element-from-heap
    # Can get it to be more efficient

    def remove(self, val):
        # find the element
        index_to_remove = self.q.index(val)
        self.q[index_to_remove] = self.q[-1]
        el = self.q.pop()
        self.q = heapq.heapify(self.q)
        return el

    # TODO: implement an iterator for it
    # For the iterator: Make a copy of the list and just extract from it.
    # Then when we find the element, call remove() on the actual heap
