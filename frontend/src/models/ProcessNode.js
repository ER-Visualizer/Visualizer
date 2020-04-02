class ProcessNode {
    constructor(id, elementType, distribution, distributionParameters, distributionFunction,
        numberOfActors, queueType, priorityFunction, children = [],
        patients = {}, priorityType, processing = {}, predictedChildren = [],
        nodeRules = [], resourceRules = []) {

      this.id = id;
      this.elementType = elementType;
      this.distribution = distribution;
      this.distributionParameters = distributionParameters;
      this.distributionFunction = distributionFunction;
      this.numberOfActors = numberOfActors;
      this.queueType = queueType;
      this.priorityFunction = priorityFunction;
      this.children = children;
      this.patients = JSON.parse(JSON.stringify(patients));
      this.processing = JSON.parse(JSON.stringify(processing));
      this.priorityType = priorityType;
      this.predictedChildren = predictedChildren;
      this.nodeRules = nodeRules;
      this.resourceRules = resourceRules;
    }
  }

export default ProcessNode;
