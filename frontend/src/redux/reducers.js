import { SHOW_LOGS_SIDEBAR, SHOW_NODE_SIDEBAR, SHOW_JSON_ENTRY_SIDEBAR, HIDE_SIDEBAR, EDIT_NODE, ADD_NODE, DELETE_NODE, CONNECT_NODE} from './actions';



const initialState = {
    showLogsSidebar: false,
    showNodeSidebar: false,
    showJSONEntrySidebar: false,
    nodeCount: 3, // max ID of any node
    nodes: [
        {
            "id": 0,
            "elementType": "reception",
            "distribution": "test",
            "distributionParameters": [5],
            "numberOfActors": 1,
            "queueType": "stack",
            "priorityFunction": "",
            "children": [2]
        },
        {
            "id": 1,
            "elementType": "triage",
            "distribution": "test",
            "distributionParameters":[3],
            "numberOfActors": 2,
            "queueType": "stack",
            "priorityFunction": "",
            "children": [3, 2]
        },
        {
            "id": 2,
            "elementType": "doctor",
            "distribution": "test",
            "distributionParameters": [10],
            "numberOfActors": 3,
            "queueType": "queue",
            "priorityFunction": "",
            "children": []
        },
        {
            "id": 3,
            "elementType": "x-ray",
            "distribution": "binomial",
            "distributionParameters": [1, 1],
            "numberOfActors": 4,
            "queueType": "queue",
            "priorityFunction": "",
            "children": [1]
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
            let temp_node_count = state.nodes.length
            return Object.assign({}, state, {
                nodesCount: temp_node_count,
                nodes: addNewNode(state.nodes, state.nodes.length)
            })

        
        // case EDIT_NODE:
        //     return Object.assign({}, state, {
        //         // nodes: updateNodes()
        //     })
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
        "distribution": "",
        "distributionParameters": [],
        "numberOfActors": 0,
        "queueType": "",
        "priorityFunction": "",
        "children": []
    })

    // modifying clonedNodes doesn't seem to modify original nodes list...

    return clonedNodes
}


export default EDSimulation;