from flask import Flask

app = Flask(__name__)

from .frequency_rule import FrequencyRule
from .prediction_rule import PredictionRule
from .frequencyafternode_rule import FrequencyafternodeRule
from .first_come_first_serve_rule import FirstComeFirstServeRule
from .requiresnode_rule import RequiresNodeRule
from .limit_acuity_rule import limitAcuityRule

"""
Factory class for creating rule object lists when parsing the canvas JSON.
"""
class RuleCreatorFactory():

    def create_rules(**kwargs):
        # can add more rule types (add more RuleCreator classes)
        if kwargs["type"] == "node":
            return NodeRuleCreator()._create_rules(kwargs["node_id"], kwargs["node_rules"], kwargs["canvas"])
        if kwargs["type"] == "resource":
            return ResourceRuleCreator()._create_rules(kwargs["node_id"], kwargs["resource_rules"], kwargs["resource"])

    create_rules = staticmethod(create_rules)

"""
Creates and returns a list of node rules (PredictionRules and FrequencyRules)
"""
class NodeRuleCreator(RuleCreatorFactory):
    def _create_rules(self, node_id, node_rules, canvas):
        created_rules = []

        for node_rule in node_rules:

            if node_rule["ruleType"] == "frequencyAfterNode":
                prediction_parent_ids = []

                # look for all nodes which have this node as a predicted child
                for other_node in canvas:
                    if "predictedChildren" in other_node and node_id in other_node["predictedChildren"]:
                        prediction_parent_ids.append(other_node["id"])

                frequencyafternode = FrequencyafternodeRule(node_rule["columnName"], node_rule["nodeId"], node_id, prediction_parent_ids)
                created_rules.append(frequencyafternode)
            # can add more rule options for node behaviour here
            elif node_rule["ruleType"] == "frequency":
                frequency = FrequencyRule(node_rule["columnName"], node_id)
                created_rules.append(frequency)
            elif node_rule["ruleType"] == "prediction":
                parent_ids = []
                # look for all nodes which have this node as a predicted child
                for other_node in canvas:
                    if "predictedChildren" in other_node and node_id in other_node["predictedChildren"]:
                        parent_ids.append(other_node["id"])

                prediction = PredictionRule(node_rule["columnName"], node_id, parent_ids)
                created_rules.append(prediction)
            elif node_rule["ruleType"] == "limitAcuity":
                validAcuity = limitAcuityRule(node_rule["columnName"], node_rule["allowedAcuity"], node_id)
                created_rules.append((validAcuity))

        return created_rules

"""
Creates and returns a list of resource rules
"""
class ResourceRuleCreator(RuleCreatorFactory):
    def _create_rules(self, node_id, resource_rules, resource):
        created_rules = []
        for resource_rule in resource_rules:

            # can add more rule options for resource/actor behaviour here
            if resource_rule["ruleType"] == "firstComeFirstServe":
                created_rules.append(
                    FirstComeFirstServeRule(node_id, resource.get_id()))
            elif resource_rule["ruleType"] == "requiresNode":
                app.logger.info("NODEID for resource rule is: {}".format(resource_rule["nodeId"]))
                requiresNode = RequiresNodeRule("", resource_rule["nodeId"], node_id)
                created_rules.append((requiresNode))

        return created_rules
