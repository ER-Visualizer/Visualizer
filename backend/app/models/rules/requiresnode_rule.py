from .csv_rule import CSVRule
from flask import Flask

app = Flask(__name__)

class RequiresNodeRule(CSVRule):

    def __init__(self, name_in_csv, required_node_id, node_id):
        super().__init__(name_in_csv, node_id)
        self.required_node_id = required_node_id

    '''receives a patient object'''
    def check(self, patient):
        app.logger.info("Requires node rule")
        app.logger.info("required node id for patient {} is {}".format(patient.get_id(), self.required_node_id))
        # patient record
        for visited_node in patient.get_patient_record().get_visited():
            app.logger.info("patient {} visited {}".format(patient.get_id(), visited_node.get_curr_process_id()))
            if visited_node.get_curr_process_id() == int(self.required_node_id):
                app.logger.info("patient {} has visited node".format(patient.get_id()))
                return True
        if patient.get_patient_record().get_curr_process_id() == int(self.required_node_id):
            app.logger.info("patient {} is on node".format(patient.get_id()))
            return True
        return False