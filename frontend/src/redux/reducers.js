import { SHOW_LOGS_SIDEBAR, SHOW_NODE_SIDEBAR, UPDATE_PATIENT_LOCATION, SHOW_JSON_ENTRY_SIDEBAR, HIDE_SIDEBAR, EDIT_NODE_PROPERTIES, ADD_NODE, DELETE_NODE, CONNECT_NODE, DELETE_LINK, DELETE_LINK_MODE, BUILD_LINK_MODE, REPLACE_NODE_LIST, SHOW_LINK_SIDEBAR, ADD_PREDICTED_CHILD, REMOVE_PREDICTED_CHILD, SIMULATION_STARTED} from './actions';
import ProcessNode from '../models/ProcessNode';
import Patient from '../models/Patient';
import { object } from 'prop-types';
if(process.env.REACT_DEV_ENV == "production"){
    console.log = function() {}

}
const initialState = {
    showLogsSidebar: false,
    showNodeSidebar: false,
    showJSONEntrySidebar: false,
    showLinkSidebar: false,
    shouldDeleteLink: false,
    shouldBuildLink: false, 
    simulationStarted: false,
    linkBeingBuilt: [], // the ID's of 2 nodes between which a link is being constructed.
    nodeCount: 5, // max ID of any node
    nodes: [
        new ProcessNode(0, "reception", "fixed", [5], 1,
            "priority queue", "", [1], [], "acuity", [], []),
        new ProcessNode(1, "triage", "fixed", [3], 2,
            "priority queue", "", [2, 3], [], "acuity", [], []),
        new ProcessNode(2, "doctor", "fixed", [10], 3,
            "priority queue", "", [3], [], "acuity", [], []),
        new ProcessNode(3, "x-ray", "binomial", [1, 1], 2,
            "priority queue", "", [], [], "acuity", [], [])
    ]
}

function EDSimulation(state = initialState, action) {
    let temp_node_count;
    switch(action.type) {
        case SHOW_LOGS_SIDEBAR:
            return Object.assign({}, state, {
                showLogsSidebar: !state.showLogsSidebar, // to allow for toggling
                showNodeSidebar: false,
                showLinkSidebar: false,
                showJSONEntrySidebar: false
            });
        case SHOW_NODE_SIDEBAR:
            return Object.assign({}, state, {
                showLogsSidebar: false, 
                showLinkSidebar: false,
                showNodeSidebar: !action.shouldHide, 
                showJSONEntrySidebar: false
            });
        case SHOW_JSON_ENTRY_SIDEBAR:
            return Object.assign({}, state, {
                showLogsSidebar: false, 
                showNodeSidebar: false, 
                showLinkSidebar: false,
                showJSONEntrySidebar: !state.showJSONEntrySidebar // to allow for toggling
            }); 
        case SHOW_LINK_SIDEBAR:
            console.log(action)
            return Object.assign({}, state, {
                showLogsSidebar: false,
                showNodeSidebar: false, 
                showJSONEntrySidebar: false,
                showLinkSidebar: !action.shouldHide
            });  
        case HIDE_SIDEBAR:
            return Object.assign({}, state, {
                showLogsSidebar: false, 
                showNodeSidebar: false, 
                showJSONEntrySidebar: false,
                showLinkSidebar: false
            }); 
        case UPDATE_PATIENT_LOCATION:
            return  Object.assign({}, state, {
                showLogsSidebar: state.showLogsSidebar, 
                showNodeSidebar: state.showNodeSidebar, 
                showJSONEntrySidebar: state.showJSONEntrySidebar,
                nodes: movePatients(state.idToIndex, state.nodes, action.events)
            }); 
        case ADD_NODE:
            temp_node_count = state.nodes.length
            return Object.assign({}, state, {
                nodesCount: temp_node_count,
                nodes: addNewNode(state.nodes, state.nodes.length)
            })
        case EDIT_NODE_PROPERTIES:
            return Object.assign({}, state, {
                nodes: updateNodeProperties(state.nodes, action.newProps)
            })
        case DELETE_NODE:
            temp_node_count = state.nodes.length
            return Object.assign({}, state, {
                nodes: deleteNodeFromState(state.nodes, action.nodeId),
                nodeCount: temp_node_count - 2, 
                linkBeingBuilt: state.linkBeingBuilt[0] === action.nodeId ? [] : state.linkBeingBuilt 
                // in case the node was part of a in-progress link
            })
        case DELETE_LINK:
            return Object.assign({}, state, {
                nodes: deleteLinkFromState(state.nodes, action.sourceId, action.targetId)
            })
        case DELETE_LINK_MODE:
            return Object.assign({}, state,
                {shouldDeleteLink: !state.shouldDeleteLink}) 
        case BUILD_LINK_MODE:
                return Object.assign({}, state,
                    {shouldBuildLink: !state.shouldBuildLink,
                    linkBeingBuilt: []}) 
        case REPLACE_NODE_LIST:
            return Object.assign({}, state,
                {nodes: action.newNodeList})
        case CONNECT_NODE:
            if (state.linkBeingBuilt.length == 1){ // connect the target node
                if (state.linkBeingBuilt[0] === action.nodeId) { // no self loops allowed       
                    return state 
                }
                let node_to_update = state.nodes.find((node) => node.id === state.linkBeingBuilt[0])
                if (node_to_update.children.indexOf(action.nodeId) !== -1){ // link already exists
                    return state
                }
                return Object.assign({}, state,
                    {
                        nodes: addLinkToState(state.nodes, state.linkBeingBuilt[0], action.nodeId), // second node in the link
                        linkBeingBuilt: []
                    }
                )
            }
            else {
                return Object.assign({}, state,  // add the source node
                    {   linkBeingBuilt: [action.nodeId],
                    }) 
            }
        case ADD_PREDICTED_CHILD:    
            return Object.assign({}, state, {
                nodes: addPredictedChildToParent(state.nodes, action.parent, action.child)
            })
        case REMOVE_PREDICTED_CHILD:
            console.log("removing predicted child")
            console.log(removePredictedChildFromParent(state.nodes, action.parent, action.child))
            return Object.assign({}, state, {
                nodes: removePredictedChildFromParent(state.nodes, action.parent, action.child)
            })
        case SIMULATION_STARTED:
                return Object.assign({}, state, {
                    simulationStarted: true,
                    idToIndex: createNodeMap(state.nodes)

                })
        default:
            return state
    }
}

const createNodeMap = (nodes) => {
    let map = {}
    for(let i = 0; i < nodes.length; i++){
        let node = nodes[i]
        map[node.id] = i
    }
    return map
}
const movePatients = (idToIndex, nodes, events) => {

    let new_nodes = nodes
    for(let i = 0; i < events.length; i++){
        let event = events[i]
        new_nodes = movePatient(idToIndex, new_nodes, event['patientId'], event['curNodeId'], event['nextNodeId'], event['patientAcuity'], event['inQueue'])
    }
    return new_nodes

}
const movePatient = (idToIndex, nodes, patient, currNode, nextNode, patientAcuity, inQueue) => {
    // moves patient A from startNode to endNode
    let clonedNodes = JSON.parse(JSON.stringify(nodes))

    // if the first node is the patient loadeer
    if (nextNode == -1){
        return clonedNodes
    }

    let patientsWithoutCurPatient;
    let processingListWithoutCurPatient;
    // add patient to the node its going to
    let nodeIndex = idToIndex[nextNode]
    let nodeToHandle = clonedNodes[nodeIndex]
    // handle adding nodes and removing patient from resource
    if(nextNode == "end"){
        // optimize removing 
        let currNodeHandle = clonedNodes[idToIndex[currNode]]
        if(patient in currNodeHandle.processing){
            delete currNodeHandle.processing[patient]
        }
        // currNodeHandle.processing = currNodeHandle.processing.filter((currPatient) => {return parseInt(currPatient.id) != parseInt(patient) });
    }else{
        if(inQueue){
            nodeToHandle.patients[patient] = new Patient(patient, patientAcuity)
        }else{
            nodeToHandle.processing[patient] = new Patient(patient, patientAcuity)
        }
    }
    // handle removing patient from queue for the resource its in
    if(nextNode != "end" && !inQueue){
           patientsWithoutCurPatient = []
           // optimize to remove patients
           if(patient in nodeToHandle.patients){
                delete nodeToHandle.patients[patient]
           }
    }

    return clonedNodes; 
}

function addNewNode(nodes, nodeNum){
    let clonedNodes = JSON.parse(JSON.stringify(nodes)) // could use rd3g deepclone (see react-d3-graph doc, utils)

    clonedNodes.push(
        new ProcessNode(nodeNum, "newNode", "newNode", [0], 0, 
            "newNode", "", [], "newNode"
        )
    )
    
    return clonedNodes
}


function updateNodeProperties(nodes, newProps){
    let clonedNodes = JSON.parse(JSON.stringify(nodes))

    clonedNodes = clonedNodes.filter((node) => node.id !== newProps.id) // remove the node
    clonedNodes.splice(newProps.id, 0, newProps) // insert updated one at the same location

    return clonedNodes    
}

function deleteNodeFromState(nodes, nodeId){ 
    
    let clonedNodes = JSON.parse(JSON.stringify(nodes))

    clonedNodes = clonedNodes.filter((node) => node.id !== nodeId) // remove the node

    clonedNodes = clonedNodes.map( // delete any connections to the node being deleted
        (node) => {
            node.children = node.children.filter((id) => (id) !== nodeId);
            return node;
        }
    )

    return clonedNodes
}


function addLinkToState(nodes, sourceId, targetId) {
    let clonedNodes = JSON.parse(JSON.stringify(nodes))
    let node_to_update = clonedNodes.find((node) => node.id === sourceId)
    
    node_to_update.children.push(targetId)

    return clonedNodes;
}

function deleteLinkFromState(nodes, sourceId, targetId){    // need to delete from the link being built as well
    let clonedNodes = JSON.parse(JSON.stringify(nodes))
    let node_to_update = clonedNodes.find(node => node.id === sourceId)
    let index = node_to_update.children.indexOf(targetId)
    
    if (index < -1){
        console.error(`Invalid target for link: (${sourceId}, ${targetId})`);
    }

    // cannot have duplicate links
    node_to_update.children.splice(index, 1) 

    // also remove child as predicted edge if it exists
    clonedNodes = removePredictedChildFromParent(clonedNodes, sourceId, targetId); 
    
    return clonedNodes;
}

function addPredictedChildToParent(nodes, parentId, childId) {
    let clonedNodes = JSON.parse(JSON.stringify(nodes))
    let node_to_update = clonedNodes.find(node => node.id == parentId);
    let index = node_to_update.predictedChildren.indexOf(childId);
    if (index <= -1) {
        node_to_update.predictedChildren.push(childId)
    }
    return clonedNodes;
}

function removePredictedChildFromParent(nodes, parentId, childId) {
    let clonedNodes = JSON.parse(JSON.stringify(nodes))
    let node_to_update = clonedNodes.find(node => node.id == parentId);
    let index = node_to_update.predictedChildren.indexOf(childId);
    if (index <= -1) {
        console.log(`Warning: child is already not a predicted child: (parent: ${parentId}, child: ${childId})`);
    }

    node_to_update.predictedChildren.splice(index, 1) 
    return clonedNodes;
}





export default EDSimulation;