/*
* action types
*/
export const SHOW_LOGS_SIDEBAR = 'SHOW_LOGS_SIDEBAR'
export const SHOW_NODE_SIDEBAR = 'SHOW_NODE_SIDEBAR'
export const SHOW_JSON_ENTRY_SIDEBAR = 'SHOW_JSON_ENTRY_SIDEBAR'
export const EDIT_NODE = 'EDIT_NODE'
export const HIDE_SIDEBAR = 'HIDE_SIDEBAR'
export const ADD_TO_LOGS = 'ADD_TO_LOGS'
export const UPDATE_QUEUE_SIZE = 'UPDATE_QUEUE_SIZE'

/*
* Action Creators
*/ 
export function showLogs() {
    return {type: SHOW_LOGS_SIDEBAR}
}

export function showNodeConfig(shouldHide) {
    return {type: SHOW_NODE_SIDEBAR, shouldHide: shouldHide}
}

export function showJSONEntrySidebar(){
    return {type: SHOW_JSON_ENTRY_SIDEBAR}
}

export function hideSidebar() {
    return {type: HIDE_SIDEBAR}
}

export function addToLogs(message) {
    return {type: ADD_TO_LOGS, message: message}
}

export function updateQueueSize(message) {
    return {type: UPDATE_QUEUE_SIZE, message: message}
}

