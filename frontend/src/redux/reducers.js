import { SHOW_LOGS_SIDEBAR, SHOW_NODE_SIDEBAR, SHOW_JSON_ENTRY_SIDEBAR, EDIT_NODE, HIDE_SIDEBAR } from './actions';

const initialState = {
    showLogsSidebar: false,
    showNodeSidebar: false,
    showJSONEntrySidebar: false,
    nodeCount: 0,
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
        // case EDIT_NODE:
        //     return Object.assign({}, state, {
        //         // nodes: updateNodes()
        //     })
        default:
            return state
    }
}



export default EDSimulation;