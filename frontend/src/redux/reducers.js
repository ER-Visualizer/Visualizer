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
        // {
        //     "id": 0,
        //     "elementType": "reception",
        //     "distribution": "receptiondist",
        //     "distributionParameters": [5],
        //     "numberOfActors": 1,
        //     "queueType": "stack",
        //     "priorityType": "receptionprior",
        //     "priorityFunction": "",
        //     "children": [2, 10],
        //     "patients": [0]
        // },
        // {
        //     "id": 1,
        //     "elementType": "triage",
        //     "distribution": "triagedist",
        //     "distributionParameters":[3],
        //     "numberOfActors": 2,
        //     "queueType": "stack",
        //     "priorityType": "triageprior",
        //     "priorityFunction": "",
        //     "children": [3, 2],
        //     "patients": []
        // },
        // {
        //     "id": 2,
        //     "elementType": "doctor",
        //     "distribution": "doctordist",
        //     "distributionParameters": [10],
        //     "numberOfActors": 3,
        //     "queueType": "queue",
        //     "priorityType": "doctorprior",
        //     "priorityFunction": "",
        //     "children": [10],
        //     "patients": []
        // },
        // {
        //     "id": 10,
        //     "elementType": "doctor",
        //     "distribution": "doctordist",
        //     "distributionParameters": [100, 30],
        //     "numberOfActors": 3,
        //     "queueType": "queue",
        //     "priorityType": "doctorprior",
        //     "priorityFunction": "",
        //     "children": [],
        //     "patients": []
        // },
        
        // {
        //     "id": 3,
        //     "elementType": "x-ray",
        //     "distribution": "xraydist",
        //     "distributionParameters": [1, 1],
        //     "numberOfActors": 4,
        //     "queueType": "queue",
        //     "priorityType": "xrayprior",
        //     "priorityFunction": "",
        //     "children": [],
        //     "patients": []
        // },
        // {
        //     "id": 4,
        //     "elementType": "station",
        //     "distribution": "stationdist",
        //     "distributionParameters": [10],
        //     "numberOfActors": 1,
        //     "queueType": "queue",
        //     "priorityType": "stationprior",
        //     "priorityFunction": "",
        //     "children": [2],
        //     "patients": []
        // }

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
                nodes: movePatient(state.nodes, action.patient, action.currNode, action.newNode, action.pAcuity, action.inQueue)
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
            // console.log(temp_node_count - 2);
            
            return Object.assign({}, state, {
                nodes: deleteNodeFromState(state.nodes, action.nodeId),
                nodeCount: temp_node_count - 2, 
                linkBeingBuilt: state.linkBeingBuilt[0] === action.nodeId ? [] : state.linkBeingBuilt
            })
        case DELETE_LINK:
            return Object.assign({}, state, {
                nodes: deleteLinkFromState(state.nodes, action.sourceId, action.targetId)
            })
        case DELETE_LINK_MODE:
            return Object.assign({}, state,
                {shouldDeleteLink: !state.shouldDeleteLink}) // reset anything in the link previously being built
        case BUILD_LINK_MODE:
                return Object.assign({}, state,
                    {shouldBuildLink: !state.shouldBuildLink,
                    linkBeingBuilt: []}) 
        case REPLACE_NODE_LIST:
            return Object.assign({}, state,
                {nodes: action.newNodeList})
        case CONNECT_NODE:
            // console.log(state.linkBeingBuilt);
            
            if (state.linkBeingBuilt.length == 1){ // connect the target node
                // console.log("checking candidate nodes");
                
                if (state.linkBeingBuilt[0] === action.nodeId) {
                    return state // no self loops allowed       
                }

                let node_to_update = state.nodes.find((node) => node.id === state.linkBeingBuilt[0])
                if (node_to_update.children.indexOf(action.nodeId) !== -1){ // link already exists
                    return state
                }
                
                // console.log("creating new link");
                return Object.assign({}, state,
                    {
                        nodes: addLinkToState(state.nodes, state.linkBeingBuilt[0], action.nodeId), // second node in the link
                        linkBeingBuilt: []
                    }
                )
            }
            else {
                // console.log("selected link source");
                
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
                    simulationStarted: true
                })
        default:
            return state
    }
}
const movePatient = (nodes, patient, currNode, nextNode, patientAcuity, inQueue) => {
    // moves patient A from startNode to endNode
    console.log("in move patient ");
    console.log("before");
    if (currNode != -1){
        console.log("inQueue", inQueue, "patient id", patient, "pAcuity", patientAcuity, "currentnode", currNode, "nextnode",nextNode)
    }
    let clonedNodes = JSON.parse(JSON.stringify(nodes))

    // if the first node is the patient loadeer
    if (currNode == -1){
        // if (inQueue){ 
        //     console.log("added -------------");
        //     console.log("patient id", patient, "pAcuity", patientAcuity, "currentnode", currNode, "nextnode",nextNode)
        //     // clonedNodes[0].patients.push(new Patient(patient, patientAcuity))        
        // }
        // console.log({clonedNodes});
        return clonedNodes
    }


    let patientsWithoutCurPatient;
    let processingListWithoutCurPatient;
    // add patient to the node its going to
    const newNodesList = clonedNodes.map((node) => {
        const newCurNode = {...node}
        if (nextNode == "end"){
            // remove patient from all resources 
            newCurNode.processing = node.processing.filter((currPatient) => {return parseInt(currPatient.id) != parseInt(patient) });
            // newCurNode.patients = node.patients.filter((currPatient) => {return parseInt(currPatient.id) != parseInt(patient) });
        }else {
            // add them to the correct one based on the inqueue value and the value of nextnodeid

            if (parseInt(node.id) === parseInt(nextNode)){

                console.log("added -------------");
                console.log(node.id)
                if (inQueue){
                    newCurNode.patients.push(new Patient(patient, patientAcuity))
                } else {
                    newCurNode.processing.push(new Patient(patient, patientAcuity))
                }
            }
        }      
        return newCurNode;
    });
    let removedNodes = newNodesList.map((node) => {
        if(nextNode == "end"){
            return node
        }
        // if patient is going to a resource, they cannot be in any other resource
            if(!inQueue){
 
               // patients have to be removed from a queue of the node they are being processed at 
               if(parseInt(node.id) == parseInt(nextNode)){
                    console.log("SAME NODE ID")

                    patientsWithoutCurPatient = []
                   for(let i = 0; i < node.patients.length; i++){
                        if(parseInt(node.patients[i].id) != parseInt(patient)){
                            patientsWithoutCurPatient.push(node.patients[i])

                        }
                   }
                
                    node.patients = patientsWithoutCurPatient
                    console.log("patient", patient, node.patients)
               }
               
               // node.patients = patientsWithoutCurPatient;
               // console.log(patient, processingListWithoutCurPatient)

            }
           
        
        return node
    });
    console.log("removed")
    console.log("patient id", patient, "pAcuity", patientAcuity, "currentnode", currNode, "nextnode",nextNode)

    console.log(removedNodes)
   
    
    console.log("results")

    return removedNodes; 
}

function addNewNode(nodes, nodeNum){
    // https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
    
    let clonedNodes = JSON.parse(JSON.stringify(nodes)) // could use rd3g deepclone (see react-d3-graph doc, utils)

    clonedNodes.push(    
        {
        "id": nodeNum,
        "elementType": "newNode",
        "distribution": "newNode",
        "distributionParameters": [0],
        "numberOfActors": 0,
        "queueType": "newNode",
        "priorityFunction": "newNode",
        "children": [],
        "patients": [],
        "predictedChildren": [],
        "processing": []
    })

    // modifying clonedNodes doesn't seem to modify original nodes list...
    
    // console.log(clonedNodes);
    
    return clonedNodes
}


function updateNodeProperties(nodes, newProps){
    // receives the node to be changed. just replace it inside the array
    // console.log(nodes);
    let clonedNodes = JSON.parse(JSON.stringify(nodes))

    clonedNodes = clonedNodes.filter((node) => node.id !== newProps.id) // remove the node
    clonedNodes.splice(newProps.id, 0, newProps) // insert updated one at the same location

    return clonedNodes    
}

function deleteNodeFromState(nodes, nodeId){ // TODO: this needs to delete the connections to 
    
    let clonedNodes = JSON.parse(JSON.stringify(nodes))

    clonedNodes = clonedNodes.filter((node) => node.id !== nodeId) // remove the node

    clonedNodes = clonedNodes.map(
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