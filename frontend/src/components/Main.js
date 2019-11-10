import React from 'react';
import Sidebar from "react-sidebar";
import NodeSidebarContent from './NodeSidebarContent'
import LogsSidebarContent from './LogsSidebarContent'
import Graph from "./react-d3-graph/components/graph/Graph";
import Navbar from "./Navbar";
import { connect } from 'react-redux';
import './Main.css';
import JSONEntrySidebarContent from './JSONEntrySidebarContent';

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

        let websocket_address = "ws://localhost:8765"
        this.socket = new WebSocket(websocket_address);
        this.socket.onopen = function(event) {
            
        }
        this.socket.onmessage = function(event) {
            this.state.events.concat(event.data)
        }
        this.socket.onerror = function(error) {
            console.log(`error ${error.message}`);
        }
        this.renderSidebarContent = this.renderSidebarContent.bind(this)
        this.sidebarLastContent = null;
    }

    renderSidebarContent() {
        if(this.props.showLogsSidebar) {
            this.sidebarLastContent = <LogsSidebarContent logs={this.state.events}/>
        } else if (this.props.showNodeSidebar) {
            this.sidebarLastContent = <NodeSidebarContent />
        } else if (this.props.showJSONEntrySidebar) {
            this.sidebarLastContent = <JSONEntrySidebarContent/>
        }

        // we return the last content so that the sidebar content
        // continues to be shown as the sidebar collapses
        // instead of abruptly disappearing.
        return this.sidebarLastContent;
    }
    
    update_graph(nodes){
        let graphical_data = {nodes: [], links: []}

        nodes.map( // map the JSON representation of the node to the representation required by the graph
            (node) => {graphical_data.nodes.push(
                { id: `${node.Id}`, name : `${node.Element_type}${node.Id}`});
                
                node.Children.map( 
                    (child) => {graphical_data.links.push(
                        { source: `${node.Id}`, target: `${child}` })}
                )
            }
        )
        
        return graphical_data;
    };

    render() {
        
        return (
            <div className="Main">
                <Sidebar
                    sidebar={this.renderSidebarContent()}
                    docked={this.props.showLogsSidebar || this.props.showNodeSidebar || this.props.showJSONEntrySidebar}
                    styles={{ sidebar: { background: "white", color: "black" } }}
                    pullRight={true}
                >
                <Navbar />
                <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={this.update_graph(this.props.nodes)}
                config={graphConfig}
                onClickNode={(nodeId) => alert(nodeId)}
                />
                </Sidebar> 
            </div>
        )
    }
}

const graphConfig = {
    nodeHighlightBehavior: true,
    width: window.innerWidth,
    height: window.innerHeight,
    directed: true,
    node: {
        color: "grey",
        size: 200,
        highlightStrokeColor: "blue",
        labelProperty: (node) => node.name 
    },
    link: {
        highlightColor: "lightblue",
    },
};

const mapStateToProps = state => {
  return {
      showLogsSidebar: state.showLogsSidebar, 
      showNodeSidebar: state.showNodeSidebar, 
      showJSONEntrySidebar: state.showJSONEntrySidebar,
      nodes: state.nodes,
    }
}


const mapDispatchToProps = dispatch => {
  return {

  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main)