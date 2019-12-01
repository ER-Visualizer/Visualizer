/*
* action types
*/
export const SHOW_LOGS_SIDEBAR = 'SHOW_LOGS_SIDEBAR'
export const SHOW_NODE_SIDEBAR = 'SHOW_NODE_SIDEBAR'
export const SHOW_JSON_ENTRY_SIDEBAR = 'SHOW_JSON_ENTRY_SIDEBAR'
export const HIDE_SIDEBAR = 'HIDE_SIDEBAR'
export const ADD_TO_LOGS = 'ADD_TO_LOGS'
export const UPDATE_PATIENT_LOCATION = 'UPDATE_PATIENT_LOCATION'

export const REPLACE_NODE_LIST = 'REPLACE_NODE_LIST'

export const EDIT_NODE_PROPERTIES = 'EDIT_NODE_PROPERTIES'
export const ADD_NODE = 'ADD_NODE'
export const UPDATE_NODE_POSITIONS = 'UPDATE_NODE_POSITION'
export const DELETE_NODE = 'DELETE_NODE'
export const CONNECT_NODE = 'CONNECT_NODE'
export const BUILD_LINK_MODE = 'BUILD_LINK_MODE'
export const DELETE_LINK = 'DELETE_LINK'
export const DELETE_LINK_MODE = 'DELETE_LINK_MODE'
export const SHOW_LINK_SIDEBAR = 'SHOW_LINK_SIDEBAR'
export const ADD_PREDICTED_CHILD = 'ADD_PREDICTED_CHILD'
export const REMOVE_PREDICTED_CHILD = 'REMOVE_PREDICTED_CHILD'

export const SIMULATION_STARTED = 'SIMULATION_STARTED'


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

export const updatePatientLocation = (events) => {
    return {type: UPDATE_PATIENT_LOCATION, events: events}
}
export function addNode(){
    return {type: ADD_NODE}
}

export function updateNodePositions(updatedNodes) {
    return {type: UPDATE_NODE_POSITIONS, updatedNodes: updatedNodes}
}

export function editNodeProperties(newProps){ 
    // newprops should be a copy of the node being edited, with the features updated
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

export function connectNode(nodeId){
    return {type: CONNECT_NODE, nodeId: nodeId}
}

export function replaceNodeList(newNodeList){
    return {type: REPLACE_NODE_LIST, newNodeList: newNodeList}
}

export function buildLinkModeSwitch(){
    return {type: BUILD_LINK_MODE}
}

export function showLinkSidebar(shouldHide) {
    return {type: SHOW_LINK_SIDEBAR, shouldHide: shouldHide}
}

export function addPredictedChild(parent, child) {
    return {type: ADD_PREDICTED_CHILD, parent: parent, child: child}
}

export function removePredictedChild(parent, child) {
    return {type: REMOVE_PREDICTED_CHILD, parent: parent, child: child}
}

export function simulationStarted() {
    return {type: SIMULATION_STARTED}
}