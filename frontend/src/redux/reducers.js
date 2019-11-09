import { SHOW_LOGS_SIDEBAR, SHOW_NODE_SIDEBAR } from './actions';

const initialState = {
    showLogsSidebar: false,
    showNodeSidebar: false
}

function EDSimulation(state = initialState, action) {
    switch(action.type) {
        case SHOW_LOGS_SIDEBAR:
            return Object.assign({}, state, {
                showLogsSidebar: !state.showLogsSidebar, // to allow for toggling
                showNodeSidebar: false
            });
        case SHOW_NODE_SIDEBAR:
            return Object.assign({}, state, {
                showLogsSidebar: false, 
                showNodeSidebar: !state.showNodeSidebar, // to allow for toggling
            });
        default:
            return state
    }
}

export default EDSimulation;