from .rule import Rule
from ..global_strings import *
class FirstComeFirstServeRule(Rule):

    '''FirstComeFirstServe is a rule for resources, rather than nodes. If patient
    has not been to any other resource, then this resource will 'claim' it, so
    if the patient ever returns to the node this resource belongs to, only this
    resource will work with him.'''
    def __init__(self, node_id, resource_id):
        self.node_id = node_id
        self.resource_id = resource_id
        self.claimed = FIRST_RESOURCE_FOR_NODE + str(node_id)
        super().__init__()


    def get_resource_id(self):
        return self.resource_id

    def get_node_id(self):
        return self.node_id

    

    def check(self, patient):

        # if the patient has already been claimed, check if its been claimed
        # by this resource. Otherwise, claim him.
        if patient.has_attribute(self.claimed):
            claimant_id = patient.get_attribute(self.claimed)
            if self.get_resource_id() == claimant_id:
                return True
            else:
                return False
        else:
            patient.set_attribute(self.claimed, self.get_resource_id())
            return True 

            
