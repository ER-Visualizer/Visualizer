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
        self.contents.append(el.id)

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


class Heap():

    # TODO: We are heapifying an already existing heap. What is time complexity on that?
    # IF bigger than O(1), just set it directly. Maybe implement a flag
    def __init__(self, l=[]):
        l = l[:]
        heapq.heapify(l)
        self.q = l

    def put(self, el):
        heapq.heappush(self.q, el)

    def get(self):
        return heapq.heappop(self.q)

    def iter_priority_queue(self):
        if len(self.q) == 0:
            return
        next_indices = [0]
        while next_indices:
            min_index = min(next_indices, key=self.q.__getitem__)
            # create generator
            yield self.q[min_index]
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
        self.q.remove(val)
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

    print(el.q)
    print(el.remove(120))
    print(el.q)
    print(el.remove_by_index(2))
    print(el.q)


if __name__ == "__main__":
    q = Queue()
    print(isinstance(q, Heap))
    print(isinstance(q, Stack))
    print(isinstance(q, Queue))
    test_remove_from_heap()
