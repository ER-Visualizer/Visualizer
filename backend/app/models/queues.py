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

    def put(self, el):
        self.q.append(el)

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
        heapq.heapify(l)
        self.q = l

    def put(self, el):
        heapq.heappush(self.q, el)

    def get(self):

        return heapq.heappop(self.q)

    def __iter__(self):
        self.length = len(self.q)
        return self.length

    def __next__(self):
        if(self.length != 0):
            next = heapq.heappop(self.q)
            self.length -= 1
            return next
        else:
            raise StopIteration()

    # https://stackoverflow.com/questions/10162679/python-delete-element-from-heap
    # Can get it to be more efficient

    def remove(self, val):
        # find the element
        index_to_remove = self.q.index(val)
        return self.remove_by_index(index_to_remove)

    def remove_by_index(self, index_to_remove):
        el = self.q[index_to_remove]
        self.q[index_to_remove] = self.q[-1]
        self.q.pop()
        heapq.heapify(self.q)
        return el

    # TODO: implement an iterator for it
    # For the iterator: Make a copy of the list and just extract from it.
    # Then when we find the element, call remove() on the actual heap


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
