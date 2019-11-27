from .csv_rule import CSVRule
class PredictionRule(CSVRule):

    def __init__(self, name_in_csv, node_id, from_node_ids):
        super().__init__(name_in_csv, node_id)
        self.from_node_ids = from_node_ids

    '''receives a patient object, checks if patient is predicted to visit'''
    def check(self, patient):

        # if the last node the patient visited is the same as one of the nodes
        # from_node_id, this means that this is a prediction edge,
        # therefore, check the prediction value.
        # Otherwise it's not a prediction edge, so just return True
        last_node_id = patient.get_patient_record().get_last_visited_node_id()
        # if there exists a last Node
        if last_node_id != None:
            # if last node is the right node for the edge
            if last_node_id in self.from_node_ids:
                predicted = patient.get_attribute(self.get_name_in_csv())
                if predicted == "TRUE":
                    return True
        return False