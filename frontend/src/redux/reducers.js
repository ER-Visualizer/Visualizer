import { SHOW_LOGS_SIDEBAR, SHOW_NODE_SIDEBAR, SHOW_JSON_ENTRY_SIDEBAR, HIDE_SIDEBAR, EDIT_NODE_PROPERTIES, ADD_NODE, DELETE_NODE, CONNECT_NODE} from './actions';



const initialState = {
    showLogsSidebar: false,
    showNodeSidebar: false,
    showJSONEntrySidebar: false,
    nodeCount: 3, // max ID of any node
    nodes: [
        {
            "id": 0,
            "elementType": "reception",
            "distribution": "receptiondist",
            "distributionParameters": [5],
            "numberOfActors": 1,
            "queueType": "receptionstack",
            "priorityFunction": "receptionprior",
            "children": [2]
        },
        {
            "id": 1,
            "elementType": "triage",
            "distribution": "triagedist",
            "distributionParameters":[3],
            "numberOfActors": 2,
            "queueType": "triagestack",
            "priorityFunction": "triageprior",
            "children": [3, 2]
        },
        {
            "id": 2,
            "elementType": "doctor",
            "distribution": "doctordist",
            "distributionParameters": [10],
            "numberOfActors": 3,
            "queueType": "doctorqueue",
            "priorityFunction": "doctorprior",
            "children": []
        },
        {
            "id": 3,
            "elementType": "x-ray",
            "distribution": "xraydist",
            "distributionParameters": [1, 1],
            "numberOfActors": 4,
            "queueType": "xrayqueue",
            "priorityFunction": "xrayprior",
            "children": [1]
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
                showNodeSidebar: true && !action.shouldHide, 
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
                nodeCount: temp_node_count - 2
            })
        default:
            return state
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
        "children": [1]
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

function deleteNodeFromState(nodes, nodeId){
    console.log(nodes[4]);
    console.log(JSON.parse(JSON.stringify(nodes)));
    
    
    let clonedNodes = JSON.parse(JSON.stringify(nodes))
    
    
    
    clonedNodes = clonedNodes.filter((node) => node.id !== nodeId) // remove the node


    console.log(clonedNodes);
    
    

    clonedNodes = clonedNodes.map(
        (node) => {
            node.children = node.children.filter((id) => (id) !== nodeId);
            return node;
        }
    )

    return clonedNodes
}




export default EDSimulation;