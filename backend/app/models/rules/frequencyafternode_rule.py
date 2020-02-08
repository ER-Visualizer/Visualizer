from .csv_rule import CSVRule
from flask import Flask

app = Flask(__name__)

class FrequencyafternodeRule(CSVRule):

    # def __init__(self, name_in_csv, node_id):
    #     super().__init__(name_in_csv, node_id)
    def __init__(self, name_in_csv, freq_node_id, node_id, from_node_ids):
        super().__init__(name_in_csv, node_id)
        self.freq_node_id = freq_node_id
        self.from_node_ids = from_node_ids

    '''receives a patient object'''
    def check(self, patient):
        app.logger.info("Frequency after node rule")
        # get how many times patient is supposed to fisit the place
        allowed_frequency = int(patient.get_attribute(self.get_name_in_csv()))
        app.logger.info("allowed frequency for patient {} is {}".format(patient.get_id(), allowed_frequency))
        # see how many times patient has already visited. Look through his
        # patient record
        num_times_visited = 0
        hasVisitedNode = False
        for node in patient.get_patient_record().get_visited():
            if node.get_curr_process_id() == int(self.freq_node_id):
                hasVisitedNode = True

        if patient.get_patient_record().get_curr_process_id() ==  int(self.freq_node_id):
            hasVisitedNode = True

        app.logger.info("HasVisited for Patient {} is {}".format(patient.get_id(), hasVisitedNode))

        if hasVisitedNode == False:
            return True

        for visited_node in patient.get_patient_record().get_visited():
            if visited_node.get_curr_process_id() == self.get_id():
                num_times_visited +=1
        if patient.get_patient_record().get_curr_process_id() == self.get_id():
            num_times_visited +=1
        app.logger.info("Number of times visited is {}".format(num_times_visited))
        # check if patient is still within the allowed frequency of visits
        if num_times_visited < allowed_frequency:
            return True
        else:
            return False