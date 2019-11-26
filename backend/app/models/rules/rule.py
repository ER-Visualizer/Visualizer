class Rule:
    

    def __init__(self, name_in_csv, node_id):
        self.node_id = node_id
        self.name_in_csv = name_in_csv
   
    def get_name_in_csv(self):
        return self.name_in_csv
    
    def get_node_id(self):
        return self.node_id

    def check(self, patient):
        return True
        
    '''receives a patient object and the name of the column in the csv file'''
    def check_frequency(self,patient, rule_csv_name):
        return True

