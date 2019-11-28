class ProcessNode {
    constructor(id, elementType, distribution, distributionParameters,
        numberOfActors, queueType, priorityFunction, children,
        patients = [], processing = []) {
      this.id = id;
      this.elementType = elementType;
      this.distribution = distribution;
      this.distributionParameters = distributionParameters;
      this.numberOfActors = numberOfActors;
      this.queueType = queueType;
      this.priorityFunction = priorityFunction;
      this.children = children;
      this.patients = patients;
      this.processing = processing;
    }
  }

export default ProcessNode;
