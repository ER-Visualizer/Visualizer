/*
* action types
*/
export const SHOW_LOGS_SIDEBAR = 'SHOW_LOGS_SIDEBAR'
export const SHOW_NODE_SIDEBAR = 'SHOW_NODE_SIDEBAR'

export const ADD_TO_LOGS = 'ADD_TO_LOGS'

/*
* Action Creators
*/ 
export function showLogs() {
    return {type: SHOW_LOGS_SIDEBAR}
}

export function showNodeConfig() {
    return {type: SHOW_NODE_SIDEBAR}
}

export function addToLogs(message) {
    return {type: ADD_TO_LOGS, message: message}
}