import { SHOW_LOGS_SIDEBAR, SHOW_NODE_SIDEBAR, UPDATE_PATIENT_LOCATION, SHOW_JSON_ENTRY_SIDEBAR, HIDE_SIDEBAR, EDIT_NODE_PROPERTIES, ADD_NODE, DELETE_NODE, CONNECT_NODE, DELETE_LINK, DELETE_LINK_MODE, BUILD_LINK_MODE, REPLACE_NODE_LIST} from './actions';
import { object } from 'prop-types';



const initialState = {
    showLogsSidebar: false,
    showNodeSidebar: false,
    showJSONEntrySidebar: false,
    shouldDeleteLink: false,
    shouldBuildLink: false, 
    linkBeingBuilt: [], // the ID's of 2 nodes between which a link is being constructed.
    nodeCount: 4, // max ID of any node
    nodes: [
        {
            "id": 0,
            "elementType": "reception",
            "distribution": "receptiondist",
            "distributionParameters": [5],
            "numberOfActors": 1,
            "queueType": "receptionstack",
            "priorityFunction": "receptionprior",
            "children": [2],
            "patients": [0],
        },
        {
            "id": 1,
            "elementType": "triage",
            "distribution": "triagedist",
            "distributionParameters":[3],
            "numberOfActors": 2,
            "queueType": "triagestack",
            "priorityFunction": "triageprior",
            "children": [3, 2],
            "patients": [],
        },
        {
            "id": 2,
            "elementType": "doctor",
            "distribution": "doctordist",
            "distributionParameters": [10],
            "numberOfActors": 3,
            "queueType": "doctorqueue",
            "priorityFunction": "doctorprior",
            "children": [],
            "patients": [],
        },
        {
            "id": 3,
            "elementType": "x-ray",
            "distribution": "xraydist",
            "distributionParameters": [1, 1],
            "numberOfActors": 4,
            "queueType": "xrayqueue",
            "priorityFunction": "xrayprior",
            "children": []
        },
        {
            "id": 4,
            "elementType": "station",
            "distribution": "stationdist",
            "distributionParameters": [10],
            "numberOfActors": 1,
            "queueType": "stationqueue",
            "priorityFunction": "stationprior",
            "children": [2]
        }

    ]
}

function EDSimulation(state = initialState, action) {
    let temp_node_count;
    switch(action.type) {
        case SHOW_LOGS_SIDEBAR:
            return Object.assign({}, state, {
                showLogsSidebar: !state.showLogsSidebar, // to allow for toggling
                showNodeSidebar: false,
                showJSONEntrySidebar: false
            });
        case SHOW_NODE_SIDEBAR:
            return Object.assign({}, state, {
                showLogsSidebar: false, 
                showNodeSidebar: !action.shouldHide, 
                showJSONEntrySidebar: false
            });
        case SHOW_JSON_ENTRY_SIDEBAR:
            return Object.assign({}, state, {
                showLogsSidebar: false, 
                showNodeSidebar: false, 
                showJSONEntrySidebar: !state.showJSONEntrySidebar // to allow for toggling
            }); 
        case HIDE_SIDEBAR:
            return Object.assign({}, state, {
                showLogsSidebar: false, 
                showNodeSidebar: false, 
                showJSONEntrySidebar: false
            }); 
        case UPDATE_PATIENT_LOCATION:
            return  Object.assign({}, state, {
                showLogsSidebar: state.showLogsSidebar, 
                showNodeSidebar: state.showNodeSidebar, 
                showJSONEntrySidebar: state.showJSONEntrySidebar,
                nodes: movePatient(state.nodes, action.patient, action.currNode, action.newNode)
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
            console.log(temp_node_count - 2);
            
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
            console.log(state.linkBeingBuilt);
            
            if (state.linkBeingBuilt.length == 1){ // connect the target node
                console.log("checking candidate nodes");
                
                if (state.linkBeingBuilt[0] === action.nodeId) {
                    return state // no self loops allowed       
                }

                let node_to_update = state.nodes.find((node) => node.id === state.linkBeingBuilt[0])
                if (node_to_update.children.indexOf(action.nodeId) !== -1){ // link already exists
                    return state
                }
                
                console.log("creating new link");
                return Object.assign({}, state,
                    {
                        nodes: addLinkToState(state.nodes, state.linkBeingBuilt[0], action.nodeId), // second node in the link
                        linkBeingBuilt: []
                    }
                )
            }
            else {
                console.log("selected link source");
                
                
                return Object.assign({}, state,  // add the source node
                    {   linkBeingBuilt: [action.nodeId],
                    }) 
            }
            

        default:
            return state
    }
}
const movePatient = (nodes, patient, currNode, newNode) => {
    // moves patient A from startNode to endNode
    console.log("in move patient ");
    // console.log({patient});
    // console.log({currNode});
    // console.log({newNode});

    
    let clonedNodes = JSON.parse(JSON.stringify(nodes))

    // if the first node is the patient loadeer
    if (currNode == -1){
        clonedNodes[0].patients.push(patient)
        // console.log(clonedNodes[0].patients);
        
        return clonedNodes
    }

    let removedPatient;
    clonedNodes.forEach((node) => {
       if (node.id == currNode){
        //    console.log("thee current nodeid that has the same id as the start node");
        //    console.log(node.id);
           removedPatient = node.patients.filter((currPatient) => currPatient.id !== patient.id );
       }
    });
    // console.log({removedPatient});

    if (removedPatient){
        // console.log({removedPatient})
        const newNodesList = clonedNodes.map(node => {
            const newCurNode = {...node}

            if (node.id == newNode){
                
            }

         


            return newCurNode

        });
        return newNodesList; 
    } else {
        return nodes;
    }
    
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
        "children": []
    })

    // modifying clonedNodes doesn't seem to modify original nodes list...
    
    console.log(clonedNodes);
    
    return clonedNodes
}


function updateNodeProperties(nodes, newProps){
    // receives the node to be changed. just replace it inside the array
    console.log(nodes);
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
    
    return clonedNodes;
}



export default EDSimulation;