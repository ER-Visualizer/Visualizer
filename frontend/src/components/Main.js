import React from 'react';
import Sidebar from "react-sidebar";
import SidebarContent from './SidebarContent'
import * as d3 from 'd3';
import { Graph } from "react-d3-graph";
import './Main.css';

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.data = {
            element_type: "triage",
            distribution: "gaussian",
            distribution_parameters: {mean: 3, variance: 1},
            number_of_actors: 10,
            queue_type: "stack",
            priority_function: "",
            children: []
        }
    }


    
    render() {
        let graphical_data = { // graphical representation
            nodes: [{ id: "Reception0" }, { id: "Triage0" }, { id: "PD0" }],
            links: [{ source: "Reception0", target: "Triage0" }, { source: "Triage0", target: "PD0" }],
            };
        
            let module_data = {
        
            }
        
            const myConfig = {
            nodeHighlightBehavior: true,
            width: window.innerWidth,
            height: window.innerHeight,
            node: {
                color: "lightgreen",
                size: 1000,
                highlightStrokeColor: "blue",
                shape: "square",
            },
            link: {
                highlightColor: "lightblue",
            },
            };
        
            const onClickNode = function(nodeId){
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
                    defaultSidebarWidth={320}
                >
                          <Graph
                            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                            data={graphical_data}
                            
                            config={myConfig}
                            onClickNode={onClickNode}
                            directed={true}
                            
                        />
                </Sidebar> 
            </div>
        )
    }
}

export default Main