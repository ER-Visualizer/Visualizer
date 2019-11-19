/*
* action types
*/
export const SHOW_LOGS_SIDEBAR = 'SHOW_LOGS_SIDEBAR'
export const SHOW_NODE_SIDEBAR = 'SHOW_NODE_SIDEBAR'
export const SHOW_JSON_ENTRY_SIDEBAR = 'SHOW_JSON_ENTRY_SIDEBAR'
export const HIDE_SIDEBAR = 'HIDE_SIDEBAR'

export const ADD_TO_LOGS = 'ADD_TO_LOGS'

export const EDIT_NODE_PROPERTIES = 'EDIT_NODE_PROPERTIES'
export const ADD_NODE = 'ADD_NODE'
export const DELETE_NODE = 'DELETE_NODE'
export const CONNECT_NODE = 'CONNECT_NODE'
export const DELETE_LINK = 'DELETE_LINK'
export const DELETE_LINK_MODE = 'DELETE_LINK_MODE'

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

export function addNode(){
    return {type: ADD_NODE}
}

export function editNodeProperties(newProps){ // newprops should be a copy of the node being edited, with the features updated
    return {type: EDIT_NODE_PROPERTIES, newProps: newProps}
    
}

export function deleteNode(nodeId){
    return {type: DELETE_NODE, nodeId: nodeId}
}

export function addLink(sourceId, targetId){
    return {type: CONNECT_NODE, sourceId: sourceId, targetId: targetId}
}

export function deleteLink(sourceId, targetId){
    return {type: DELETE_LINK, sourceId: sourceId, targetId: targetId}
}

export function deleteLinkModeSwitch(){
    return {type: DELETE_LINK_MODE}
}