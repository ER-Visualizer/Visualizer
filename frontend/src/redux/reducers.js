import { SHOW_LOGS_SIDEBAR, SHOW_NODE_SIDEBAR, SHOW_JSON_ENTRY_SIDEBAR, EDIT_NODE, HIDE_SIDEBAR } from './actions';
import ProcessNode from '../models/ProcessNode';
import Patient from '../models/Patient';

const initialState = {
    showLogsSidebar: false,
    showNodeSidebar: false,
    showJSONEntrySidebar: false,
    nodeCount: 0,
    nodes: [
        new ProcessNode(0, "reception", "receptiondist", [5], 1,
            "receptionstack", "receptionprior", [2],
            [new Patient(0, 2), new Patient(1, 3)]),
        new ProcessNode(1, "triage", "triagedist", [3], 2,
            "triagestack", "triageprior", [3, 2],
            [new Patient(2, 4), new Patient(3, 1)]),
        new ProcessNode(2, "doctor", "doctordist", [10], 3,
            "doctorqueue", "doctorprior", [],
            [new Patient(1, 5), new Patient(3, 2)]),
        new ProcessNode(3, "x-ray", "xraydist", [1, 1], 4,
            "xrayqueue", "xrayprior", [1],
            [])
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
        // case EDIT_NODE:
        //     return Object.assign({}, state, {
        //         // nodes: updateNodes()
        //     })
        default:
            return state
    }
}



export default EDSimulation;