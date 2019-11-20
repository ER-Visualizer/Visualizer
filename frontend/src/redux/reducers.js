import { SHOW_LOGS_SIDEBAR, SHOW_NODE_SIDEBAR, SHOW_JSON_ENTRY_SIDEBAR, EDIT_NODE, HIDE_SIDEBAR, UPDATE_PATIENT_LOCATION } from './actions';

const initialState = {
    showLogsSidebar: false,
    showNodeSidebar: false,
    showJSONEntrySidebar: false,
    nodeCount: 0,
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
            "children": [1],
            "patients": [],
        }
    ]
}

function EDSimulation(state = initialState, action) {
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
        console.log(clonedNodes[0].patients);
        
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

export default EDSimulation;