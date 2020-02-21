from .csv_rule import CSVRule
from flask import Flask

app = Flask(__name__)

class limitAcuityRule(CSVRule):

    # def __init__(self, name_in_csv, node_id):
    #     super().__init__(name_in_csv, node_id)
    def __init__(self, name_in_csv, allowed_acuity, node_id):
        super().__init__(name_in_csv, node_id)
        self.allowed_acuity = allowed_acuity

    '''receives a patient object'''
    def check(self, patient):
        app.logger.info("Limit Acuity rule")
        patient_acuity = int(patient.get_attribute(self.get_name_in_csv()))
        app.logger.info("patient {} acuity is {}".format(patient.get_id(), patient_acuity))
        allowed_acuity = [int(x) for x in self.allowed_acuity.split(',') if x.strip().isdigit()]
        # for x in allowed_acuity:
        #     app.logger.info("Allowed acuity is {}".format(x))
        if patient_acuity in allowed_acuity:
            return True
        return False
