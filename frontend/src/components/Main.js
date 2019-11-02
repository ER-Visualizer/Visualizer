import React from 'react';
import Sidebar from "react-sidebar";
import SidebarContent from './SidebarContent'
import './Main.css';

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.data = {
            element_type: "triage",
            distribution: "gaussian",
            distribution_parameters: {mean: "3", variance: "1"},
            number_of_actors: "10",
            queue_type: "stack",
            priority_function: "",
            children: []
        }
    }

    render() {
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
                    <p> Child content </p>
                </Sidebar> 
            </div>
        )
    }
}

export default Main