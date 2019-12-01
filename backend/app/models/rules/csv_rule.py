from .rule import Rule
from abc import ABC, abstractmethod
 

class CSVRule(Rule):
    
    '''el_id can be either id of a node or of a resource'''
    def __init__(self, name_in_csv, el_id):
        self.id = el_id
        self.name_in_csv = name_in_csv
        super().__init__()
   
    def get_name_in_csv(self):
        return self.name_in_csv
    
    def get_id(self):
        return self.id

    @abstractmethod
    def check(self, patient):
        pass