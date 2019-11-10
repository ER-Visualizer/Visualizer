import heapq
from app.models.event import Event

canvas = [{"id": 1}]
nodes = {}
event_heap = []

"""
Setup Canvas:

input = list of nodes [{id: ..., next: [...]}, ... ] as json

def parser(Node[List[nodes]]):
  set canvas_json as the hard coded demo cases
"""

def create_queues():
  for node in canvas:
    # Each node will create a queue and actors or will I create them here?

    # nodes[node[id]] = Node(node[id], node[process_name], node[distribution], node[distribution_parameters],
    #                        node[num_actors], node[queue_type], node[priority_function], node[output_processes])
    pass

"""
Create event heap
"""
def create_heap(heap):
  heapq.heapify(event_heap)

  # test of push, pop, and replace
  heapq.heappush(heap, Event(10, 1, 1))
  heapq.heappush(heap, Event(7, 1, 1))
  heapq.heappush(heap, Event(4, 1, 1))
  heapq.heappush(heap, Event(98, 1, 1))
  heapq.heappush(heap, Event(5, 1, 1))
  heapq.heappush(heap, Event(0, 1, 1))
  heapq.heappush(heap, Event(0, 1, 1))
  heapq.heappush(heap, Event(1, 1, 1))
  heapq.heappush(heap, Event(0, 1, 1))
  heapq.heappush(heap, Event(10, 1, 1))
  heapq.heappush(heap, Event(10, 1, 1))
  heapq.heappush(heap, Event(10, 1, 1))

  heapq.heappop(heap)
  heapq.heappop(heap)

  heapq.heapreplace(heap, Event(105, 1, 1))

def get_curr_time():

  raise Exception("need to implement")
  

def get_heap():
  raise Exception("need to implement")
  
if __name__ == "__main__":
  create_heap(event_heap)
  for e in event_heap:
    print(e.event_time)