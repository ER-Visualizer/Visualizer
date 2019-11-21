
import { SHOW_LOGS_SIDEBAR, SHOW_NODE_SIDEBAR, SHOW_JSON_ENTRY_SIDEBAR, EDIT_NODE, HIDE_SIDEBAR } from './actions';

const initialState = {
    showLogsSidebar: false,
    showNodeSidebar: false,
    showJSONEntrySidebar: false,
    nodeCount: 0,
    nodes: [ // hardcoded data
        {
            Id: 0,
            Element_type: "reception(1)",
            Distribution: "gaussian", // dummy variables for now
            Distribution_parameters: [3,1],
            Number_of_actors: 10,
            Queue_type: "stack",
            Priority_function: "",
            Children: [5]
        },
        {
            Id: 5,
            Element_type: "triage(2)",
            Distribution: "gaussian", 
            Distribution_parameters: [3,1],
            Number_of_actors: 10,
            Queue_type: "stack",
            Priority_function: "",
            Children: [2]
        },
        {
            Id: 2,
            Element_type: "pd(3)",
            Distribution: "gaussian", 
            Distribution_parameters: [3,1],
            Number_of_actors: 10,
            Queue_type: "stack",
            Priority_function: "",
            Children: [5]
        },
        {
            Id: 7,
            Element_type: "pd(7)",
            Distribution: "gaussian", 
            Distribution_parameters: [3,1],
            Number_of_actors: 10,
            Queue_type: "stack",
            Priority_function: "",
            Children: []
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