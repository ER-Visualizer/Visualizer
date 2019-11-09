import React from 'react';
import Sidebar from "react-sidebar";
import SidebarContent from './SidebarContent'
import Graph from "./react-d3-graph/components/graph/Graph";
import Navbar from "./Navbar";
import './Main.css';

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            events: []
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

        let websocket_address = "wss://dummy_url.com"
        this.socket = new WebSocket(websocket_address);
        this.socket.onopen = function(event) {

        }
        this.socket.onmessage = function(event) {
            this.state.events.append(event.data)
        }
        this.socket.onerror = function(error) {
            console.log(`error ${error.message}`);
        }
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
                // lookup node's data
                // 

                alert(nodeId);
            }
        
        return (
            <div className="Main">
                <Sidebar
                    sidebar={
                        <SidebarContent data={this.data}/>
                    }
                    docked={true}
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

export default Main