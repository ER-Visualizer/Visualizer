from resource import Resource
from patient import Patient
import unittest

class TestResource(unittest.TestCase):
    
    def test_get_id(self):
            res = Resource(3)
            self.assertEqual(3,res.get_id())
    
    def test_insert_patient(self):
            res = Resource(3)
            p = Patient(3,10)
            self.assertTrue(p.is_available)
            res.insert_patient(p,25,10)
            assert(25 == res.get_finish_time())
            self.assertFalse(p.is_available)
        



if __name__ == "__main__":   
        unittest.main()
