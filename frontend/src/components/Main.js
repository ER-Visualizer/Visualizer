import React from 'react';
import Sidebar from "react-sidebar";
import NodeSidebarContent from './NodeSidebarContent'
import LogsSidebarContent from './LogsSidebarContent'
import LinkSidebarContent from './LinkSidebarContent'
import Graph from "./react-d3-graph/components/graph/Graph";
import Navbar from "./Navbar";
import { connect } from 'react-redux';
import './Main.css';
import JSONEntrySidebarContent from './JSONEntrySidebarContent';

import { showNodeConfig, hideSidebar, updatePatientLocation, deleteLink, connectNode, showLinkSidebar} from '../redux/actions';
import Slider from './Slider.js'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            events: [],
            selectedNode: null,
            selectedLink: null,
            ws: null,
            run: false,
            rate: 1,
            duration: 5,
            stats: []
        }
        this.renderSidebarContent = this.renderSidebarContent.bind(this)
        this.sidebarLastContent = null;
        this.child = React.createRef();
    }
    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    runHandler = async () =>{
        for(let i = 0; i < this.props.nodes.length; i++){
            this.props.nodes[i].patients = []
            this.props.nodes[i].processing = []
        }
        await this.sleep(5000);
        // console.log("run handler")
        this.setState({run: true,
                       statsAvailable: false})
        this.connect();
    }

    parseEventData(eventData) {
        if(eventData.inQueue === true){
            return {
                eventData: eventData,
                message: `[${eventData.timeStamp}] Patient ${eventData['patientId']} joined ${eventData['movedTo']}'s queue from ${eventData['startedAt']}`
            }
        }
        else if(eventData.nextNodeId === "end"){
            return {
                eventData: eventData,
                message: `[${eventData.timeStamp}] Patient ${eventData['patientId']} has left ${eventData['startedAt']}`
            }
        }
        return {
            eventData: eventData,
            message: `[${eventData.timeStamp}] Patient ${eventData['patientId']} is being processed by ${eventData['movedTo']} resource`
        }
    }
    timeout = 250; // Initial timeout duration as a class variable

    /**
     * @function connect
     * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
     */
    connect = () => {
        // console.log("connect")
        // console.log(this.state.run)

        var ws = new WebSocket("ws://localhost:" + process.env.REACT_APP_WEB_SOCKET_PORT);
        let that = this; // cache the this
        var connectInterval;
        // websocket onopen event listener
        ws.onopen = () => {
            console.log("connected websocket main component");

            this.setState({ ws: ws });

            that.timeout = 250; // reset timer to 250 on open of websocket connection 
            clearTimeout(connectInterval); // clear Interval on on open of websocket connection
        };

        ws.onmessage = event => {
            // console.log("raw event")
            // console.log(event.data);
                // console.log(this.parseEventData(event.data))
                const eventData = JSON.parse(event.data)
                // console.log(eventData)
                const events = eventData["Events"]
                // console.log("events")
                // console.log(events)
                let updated_events = []
                if(events != undefined && events.length != []){
                    let new_events = this.state.events
                    let prev = null
                    for(let i = 0; i < events.length; i++){
                        let event = events[i]
                        if(prev === null || ( prev != null && JSON.stringify(event) != JSON.stringify(prev))){
                            new_events = new_events.concat(this.parseEventData(event))
                            updated_events.push(event)

                        }
                        prev = event

                    }
                    this.setState({
                    events: new_events
                    })
                    // console.log(events, updated_events)
                    this.updateNodePatients(updated_events)
                }
                else if(eventData["stats"] === "true"){
                    delete eventData['stats']
                    // console.log("recieved stats")
                    // console.log(eventData)
                    this.setState({
                    events: this.state.events.concat({message: JSON.stringify(eventData)}),
                    run: false,
                    stats: eventData
                    })
                    // console.log({eventData});
                    this.child.updateRunButton()
                }
        }

        // websocket onclose event listener
        ws.onclose = e => {
            // console.error(
            //     `Socket is closed. Reconnect will be attempted in ${Math.min(
            //         10000 / 1000,
            //         (that.timeout + that.timeout) / 1000
            //     )} second.`,
            //     e.reason
            // );

            that.timeout = that.timeout + that.timeout; //increment retry interval
            connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
        };

        // websocket onerror event listener
        ws.onerror = err => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );

            ws.close();
        };
    

    };

    /**
     * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
     */
    check = () => {
        const { ws, run } = this.state;
        if (run && (!ws || ws.readyState === WebSocket.CLOSED)) this.connect(); //check if websocket instance is closed, if so call `connect` function.
    };
    componentDidMount() {
     
        // this.connect();
    }
    componentWillUnmount() {
      if (this.state.ws) {
              this.state.ws.close();
          }
    }

    updateNodePatients(new_events) {
        // console.log("in updatenodepatients");
        // console.log(this.state.events);
        this.props.updatePatientLocation(new_events)
        // new_events.forEach((event) => {    
        //     this.props.updatePatientLocation(event['patientId'], event['curNodeId'], event['nextNodeId'], event['patientAcuity'], event['inQueue'])
        // })
    }

    renderSidebarContent() {
        if(this.props.showLogsSidebar) {
            this.sidebarLastContent = <LogsSidebarContent logs={this.state.events}/>
        } else if (this.props.showNodeSidebar && this.state.selectedNode) {
            if (this.props.nodes[this.state.selectedNode]){ // node becomes undefined after we delete it 
                let node_to_send = JSON.parse(JSON.stringify(this.props.nodes[this.state.selectedNode])) // deepcopy
                this.sidebarLastContent = <NodeSidebarContent node={node_to_send} numNodes={this.props.nodes.length}/>
            }
            
        } else if (this.props.showJSONEntrySidebar) {
            this.sidebarLastContent = <JSONEntrySidebarContent/>
        } else if (this.props.shouldShowLinkSidebar) {
            this.sidebarLastContent = <LinkSidebarContent 
                    parent={this.state.selectedLink.parentId}
                    child={this.state.selectedLink.childId} />
        } else {
            // return no content to be displayed on the sidebar
            // this is needed otherwise the Sidebar component will
            // log an error saying that no content was given to the sidebar
            return <div></div>
        }

        // we return the last content so that the sidebar content
        // continues to be shown as the sidebar collapses
        // instead of abruptly disappearing.
        return this.sidebarLastContent;
    }

    renderNode() {
        return <div className="object">Hello world</div>
    }
    
    update_graph(nodes){// Map the store's node model to rd3g's node model
        let graphical_data = {nodes: [], links: []}
        nodes.map( 
            (node) => {graphical_data.nodes.push(
                { 
                    id: `${node.id}`,
                    name : `${node.elementType}${node.id}`,
                    ...node
                });
                
                node.children.map( 
                    (child) => {graphical_data.links.push(
                        { source: node.id, target: child })}
                )
            }
        )
        // console.log(graphical_data);
        return graphical_data;
    };

    nodeClick(nodeId) {
        // console.log(nodeId);
        
        if (this.props.shouldBuildLink){
            this.props.connectNode(parseInt(nodeId))
        } 
        else { // dont toggle sidebars when build link mode on

            const shouldHide = (nodeId === this.state.selectedNode) && this.props.showNodeSidebar // if node is clicked twice, hide it
            let timeout = 0;

            this.setState({
                selectedNode: nodeId
            })
            this.props.showNodeConfig(shouldHide);
        }
        
    }
    handleSliderRate(e){
        this.setState({rate: e.target.value})
    }
    handleSliderDuration(e){
        this.setState({duration: e.target.value})
    }
    linkClick(source, target){
        if (this.props.shouldDeleteLink){
            
            this.props.deleteLink(parseInt(source), parseInt(target)) // react-d3-graph gives strings for these...            
        } else {
            const shouldHide = this.state.selectedLink?.parentId?.toString() === source && this.state.selectedLink?.childId?.toString() === target
            
            if (shouldHide) {
                this.setState({
                    selectedLink: null
                });
            } else {
                this.setState({
                    selectedLink: {
                        parentId: parseInt(source),
                        childId: parseInt(target)
                    }
                });
            }
            this.props.showLinkSidebar(shouldHide);
        }
    }

    sidebarColor() {
        if(this.props.showLogsSidebar) {
            return "#01121E";
        } else {
            return "white";
        }
    }

    sidebarBorder() {
        if(this.props.showLogsSidebar) {
            return "1px solid black";
        } else {
            return "none";
        }
    }

    render() {
        console.log("rendering main.js", this.props.nodes);
        return (
            <div className="Main">
                <Sidebar
                    sidebar={this.renderSidebarContent()}
                    docked={this.props.showLogsSidebar || this.props.showNodeSidebar || this.props.showJSONEntrySidebar || this.props.shouldShowLinkSidebar}
                    styles={{ sidebar: { background: this.sidebarColor(), color: "black", border: this.sidebarBorder() } }}
                    pullRight={true}
                >
                <Navbar stats={this.state.stats}
                        runHandler={this.runHandler} 
                        onRef={ref => (this.child = ref)} 
                        rate={this.state.rate} 
                        duration={this.state.duration}/>
                <Graph
                directed={true}
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={this.update_graph(this.props.nodes)}
                config={graphConfig}
                onClickNode={this.nodeClick.bind(this)}
                onClickLink={this.linkClick.bind(this)}
                />
                </Sidebar>
                <div className="slider">
                <button className="HelpButton" onClick={()=>window.open("https://csc301-fall-2019.github.io/team-project-ml-simulation-vector-institute/", "_blank")}>?</button>
                <Slider initNum={this.state.rate} max={10} handleClick={this.handleSliderRate.bind(this)} text="Packet Rate (seconds)" > </Slider>
                <Slider initNum={this.state.duration} max={100} handleClick={this.handleSliderDuration.bind(this)} text="Packet Duration (mins)"> </Slider>
                </div>
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
        size: 30,
        highlightStrokeColor: "blue",
        labelProperty: (node) => node.name 
    },
    link: {
        type: "CURVE_SMOOTH",
    },
};

const mapStateToProps = state => {
  return {
      shouldDeleteLink: state.shouldDeleteLink, 
      shouldBuildLink: state.shouldBuildLink,
      showLogsSidebar: state.showLogsSidebar, 
      showNodeSidebar: state.showNodeSidebar, 
      showJSONEntrySidebar: state.showJSONEntrySidebar,
      shouldShowLinkSidebar: state.showLinkSidebar,
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
        },
        updatePatientLocation: (events) => {
            dispatch(updatePatientLocation(events))
        },
        deleteLink: (sourceId, targetId) => {
            dispatch(deleteLink(sourceId, targetId))
        },
        connectNode: (nodeId) => {
            dispatch(connectNode(nodeId))
        },
        showLinkSidebar: (shouldHide) => {
            dispatch(showLinkSidebar(shouldHide))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main)