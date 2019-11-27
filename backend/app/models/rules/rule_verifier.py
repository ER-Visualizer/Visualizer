class RuleVerifier:


    '''check if the patient passes all of the rules in order to see whether
    patient is eligible to visit'''
    @staticmethod
    def pass_rules(patient, rules):
        passes_rule = True
        counter = 0
        while passes_rule and counter < len(rules):
            rule = rules[counter]
            passes_rule = rule.check(patient)
            counter += 1
        return passes_rule