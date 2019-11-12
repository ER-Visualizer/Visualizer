import React from 'react';
import Sidebar from "react-sidebar";
import NodeSidebarContent from './NodeSidebarContent'
import LogsSidebarContent from './LogsSidebarContent'
import Graph from "./react-d3-graph/components/graph/Graph";
import Navbar from "./Navbar";
import { connect } from 'react-redux';
import './Main.css';
import JSONEntrySidebarContent from './JSONEntrySidebarContent';
import { showNodeConfig, hideSidebar } from '../redux/actions';

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            events: [],
            selectedNode: null
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

    parseEventData(rawEventDataString) {
        const eventData = JSON.parse(rawEventDataString)
        return {
            eventData: eventData,
            message: `[${eventData.timeStamp}] user ${eventData['userId']} moved to queue ${eventData['movedTo']} from queue ${eventData['startedAt']}`
        }
    }

    // componentDidMount() {
    //     // timer is needed because if you setState exactly after
    //     // the component mounts there will be some layout issues
    //     // so we wait at least on second before any states are set
    //     setTimeout(function() {
    //         let websocket_address = "ws://localhost:8765"
    //         this.socket = new WebSocket(websocket_address);
    //         this.socket.onopen = function(event) {
    //             this.socket.send("Ping");
    //         }.bind(this)

    //         this.socket.onmessage = function(event) {
    //             console.log(event.data);
    //             console.log(this.parseEventData);
    //             console.log(this.parseEventData(event.data))
    //             this.setState({
    //                 events: this.state.events.concat(this.parseEventData(event.data))
    //             })
    //         }.bind(this)
    
    //         this.socket.onerror = function(error) {
    //             console.log(`error ${error.message}`);
    //         }
    //     }.bind(this), 1000)
    // }

    renderSidebarContent() {
        if(this.props.showLogsSidebar) {
            this.sidebarLastContent = <LogsSidebarContent logs={this.state.events}/>
        } else if (this.props.showNodeSidebar && this.state.selectedNode) {
            this.sidebarLastContent = <NodeSidebarContent data={this.props.nodes[this.state.selectedNode] }/>
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

    nodeClick(nodeId) {
        const shouldHide = (nodeId == this.state.selectedNode) && this.props.showNodeSidebar // if node is clicked twice, hide it
        console.log(shouldHide);
        this.setState({
            selectedNode: nodeId
        })
        this.props.hideSidebar();
        setTimeout(function() {
            this.props.showNodeConfig(shouldHide);
        }.bind(this), 300);
    }

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
                onClickNode={this.nodeClick.bind(this)}
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
        showNodeConfig: (shouldHide) => {
            dispatch(showNodeConfig(shouldHide))
        },
        hideSidebar: () => {
            dispatch(hideSidebar())
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main)