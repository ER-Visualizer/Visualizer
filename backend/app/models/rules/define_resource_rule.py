from .csv_rule import CSVRule
from flask import Flask

app = Flask(__name__)

class DefineResourceRule(CSVRule):

    def __init__(self, name_in_csv, defined_function, node_id):
        super().__init__(name_in_csv, node_id)
        self.defined_function = defined_function

    '''receives a patient object'''
    def check(self, patient):
        app.logger.info("Defined Resource Rule")
        app.logger.info("Defined rule for patient {} is: {}".format(patient.get_id(), self.defined_function))

        """
         Helper function to help fix spacing and remove empty lines
         Assign self.d_func to be the parse string
         """
        split = self.defined_function.split("\n")
        new_split = []
        for line in split:
             line = line.strip()
             if line:
                 new_split.append(line + "\n")
        defined_function = "".join(new_split)
        app.logger.info("parsed resource function:")
        app.logger.info(self.defined_function)

        rule_result = False
        l = locals()
        # executes input code string
        # need to pass in locals and globals to mutate _p_value
        exec(self.defined_function, globals(), l)
        app.logger.info(l['rule_result'])
        rule_result = l['rule_result']

        return rule_result