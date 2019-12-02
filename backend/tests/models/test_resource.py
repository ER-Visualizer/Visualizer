from backend.app.models.resource import Resource
from backend.app.models.patient import Patient
from backend.app.models.global_strings import *
from backend.app.models.event import Event

import unittest

class TestResource(unittest.TestCase):
    
        def test_get_id(self):
                res = Resource(3)
                self.assertEqual(3,res.get_id())
    
        def test_insert_patient(self):
                res = Resource(3)
                p = Patient({ID:10,START_TIME:4})
                self.assertTrue(p.is_available)
                res.insert_patient(p,1,25,3)        
                assert(25 == res.get_finish_time())
                self.assertFalse(p.is_available)
                                      



if __name__ == "__main__":   
        unittest.main()
