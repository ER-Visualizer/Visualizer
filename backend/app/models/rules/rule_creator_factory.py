from .frequency_rule import FrequencyRule
from .prediction_rule import PredictionRule
from .first_come_first_serve_rule import FirstComeFirstServeRule

class RuleCreatorFactory():

    def create_rules(**kwargs):
        if kwargs["type"] == "node":
            return NodeRuleCreator()._create_rules(kwargs["node_id"], kwargs["node_rules"], kwargs["canvas"])
        if kwargs["type"] == "resource":
            return ResourceRuleCreator()._create_rules(kwargs["node_id"], kwargs["resource_rules"], kwargs["resource"])

    create_rules = staticmethod(create_rules)


class NodeRuleCreator(RuleCreatorFactory):
    def _create_rules(self, node_id, node_rules, canvas):
        created_rules = []

        for node_rule in node_rules:
            if node_rule["ruleType"] == "frequency":
                frequency = [node_rule["columnName"], node_id]
                created_rules.append(frequency)

            elif node_rule["ruleType"] == "prediction":
                parent_ids = []
                for other_node in canvas:
                    if "predicted_children" in other_node and node_id in other_node["predicted_children"]:
                        parent_ids.append(other_node["id"])

                prediction = [node_rule["columnName"], node_id, parent_ids]
                created_rules.append(prediction)

            return created_rules


class ResourceRuleCreator(RuleCreatorFactory):
    def _create_rules(self, node_id, resource_rules, resource):
        created_rules = []
        for resource_rule in resource_rules:
            if resource_rule["ruleType"] == "firstComeFirstServe":
                created_rules.append(
                    FirstComeFirstServeRule(node_id, resource.get_id()))

        return created_rules
