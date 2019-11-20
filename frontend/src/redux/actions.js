/*
* action types
*/
export const SHOW_LOGS_SIDEBAR = 'SHOW_LOGS_SIDEBAR'
export const SHOW_NODE_SIDEBAR = 'SHOW_NODE_SIDEBAR'
export const SHOW_JSON_ENTRY_SIDEBAR = 'SHOW_JSON_ENTRY_SIDEBAR'
export const EDIT_NODE = 'EDIT_NODE'
export const HIDE_SIDEBAR = 'HIDE_SIDEBAR'
export const ADD_TO_LOGS = 'ADD_TO_LOGS'
export const UPDATE_PATIENT_LOCATION = 'UPDATE_PATIENT_LOCATION'

/*
* Action Creators
*/ 
export const showLogs = () => {
    return {type: SHOW_LOGS_SIDEBAR}
}

export const showNodeConfig = (shouldHide) => {
    return {type: SHOW_NODE_SIDEBAR, shouldHide: shouldHide}
}

export const showJSONEntrySidebar = () => {
    return {type: SHOW_JSON_ENTRY_SIDEBAR}
}

export const  hideSidebar = () => {
    return {type: HIDE_SIDEBAR}
}

export const addToLogs = (message) => {
    return {type: ADD_TO_LOGS, message: message}
}

export const updatePatientLocation = (patient, currNode, newNode) => {
    return {type: UPDATE_PATIENT_LOCATION, currNode: currNode, newNode: newNode,  patient: patient}
}
