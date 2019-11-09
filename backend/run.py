import multiprocessing as mp
from multiprocessing.managers import BaseManager
from multiprocessing import Process, Queue

  
"""
Setup:

input = canvas_json: list of nodes [{id: ..., next: [...]}, ... ]
"""

if __name__=='__main__':
  # kinda pseudocode for now

  node_queues = {}
  canvas_json = {}

  """
  if canvas_json "is first demo case":
    # first demo case
    canvas_json = {}
    pass
  else:
    # second demo case
    canvas_json = {}
    pass 
  """

  i=0
  for node in canvas_json:
    node_queues[node.id] = Queue()
    
    BaseManager.register('node_queues[node.id]', callable=lambda: node_queues[node.id])
    i += 1

  manager = BaseManager(address=('', 50000), authkey=b'abc')
  server = manager.get_server()
  server.serve_forever()



"""
Other processes connecting:
"""
def connect_basemanager():
  m = BaseManager(address=('127.0.0.1', 50000), authkey=b'abc')
  m.connect()
