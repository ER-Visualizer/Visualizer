import React from 'react';
import Sidebar from "react-sidebar";
import NodeSidebarContent from './NodeSidebarContent'
import LogsSidebarContent from './LogsSidebarContent'
import Graph from "./react-d3-graph/components/graph/Graph";
import Navbar from "./Navbar";
import { connect } from 'react-redux';
import './Main.css';

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            events: ["Hello world", "i like pizza"]
        }
        this.data = {
            element_type: "triage",
            distribution: "gaussian",
            distribution_parameters: {mean: "3", variance: "1"},
            number_of_actors: "10",
            queue_type: "stack",
            priority_function: "",
            children: []
        }
        this.renderSidebarContent = this.renderSidebarContent.bind(this)
        this.sidebarLastContent = null;
    }

    componentDidMount() {
        // timer is needed because if you setState exactly after
        // the component mounts there will be some layout issues
        // so we wait at least on second before any states are set
        setTimeout(function() {
            let websocket_address = "ws://localhost:8765"
            this.socket = new WebSocket(websocket_address);
            this.socket.onopen = function(event) {
                this.socket.send("Ping");
            }.bind(this)
            
            this.socket.onmessage = function(event) {
                this.setState({
                    events: this.state.events.concat(event.data)
                })
            }.bind(this)
    
            this.socket.onerror = function(error) {
                console.log(`error ${error.message}`);
            }
        }.bind(this), 1000)
    }

    renderSidebarContent() {
        if(this.props.showLogsSidebar) {
            this.sidebarLastContent = <LogsSidebarContent logs={this.state.events}/>
        } else if (this.props.showNodeSidebar) {
            this.sidebarLastContent = <NodeSidebarContent />
        }
        // we return the last content so that the sidebar content
        // continues to be shown as the sidebar collapses
        // instead of abruptly disappearing.
        return this.sidebarLastContent;
    }
    
    render() {
        // TODO: move these properties out later
        let graphical_data = { // graphical representation
            nodes: [{ id: "Reception0" }, { id: "Triage0" }, { id: "PD0" }],
            links: [{ source: "Reception0", target: "Triage0" }, { source: "Triage0", target: "PD0" }],
            };
        
            let module_data = [
                    {
                        Id: 0,
                        Element_type: "reception",
                        Distribution: "gaussian", // dummy variables for now
                        Distribution_parameters: [3,1],
                        Number_of_actors: 10,
                        Queue_type: "stack",
                        Priority_function: "",
                        Children: [2, 3]
                    },
                    {
                        Id: 1,
                        Element_type: "triage",
                        Distribution: "gaussian", 
                        Distribution_parameters: [3,1],
                        Number_of_actors: 10,
                        Queue_type: "stack",
                        Priority_function: "",
                        Children: [2, 3]
                    },
                    {
                        Id: 2,
                        Element_type: "pd",
                        Distribution: "gaussian", 
                        Distribution_parameters: [3,1],
                        Number_of_actors: 10,
                        Queue_type: "stack",
                        Priority_function: "",
                        Children: [2, 3]
                    },
                    
            ]
        
            const myConfig = {
            nodeHighlightBehavior: true,
            width: window.innerWidth,
            height: window.innerHeight,
            directed: true,
            node: {
                color: "grey",
                size: 200,
                highlightStrokeColor: "blue",
                // symbolType: "squacircle",
            },
            link: {
                highlightColor: "lightblue",

            },
            };
        
            const onClickNode = function(nodeId){

                console.log(nodeId);
            }
        
        return (
            <div className="Main">
                <Sidebar
                    sidebar={this.renderSidebarContent()}
                    docked={this.props.showLogsSidebar || this.props.showNodeSidebar}
                    styles={{ sidebar: { background: "white", color: "black" } }}
                    pullRight={true}
                >
                <Navbar />
                <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={graphical_data}
                config={myConfig}
                onClickNode={onClickNode}
                />
                </Sidebar> 
            </div>
        )
    }
}

const mapStateToProps = state => {
  return {showLogsSidebar: state.showLogsSidebar, showNodeSidebar: state.showNodeSidebar}
}

const mapDispatchToProps = dispatch => {
  return {

  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main)