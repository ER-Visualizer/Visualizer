import React, { Component } from 'react'
import './JSONEntrySidebarContent.css'

class JSONEntrySidebarContent extends Component {

    render() {
        return (
            <div className="JSONEntrySidebarContent">
                <label>Layout JSON</label>
                <input type="text" name="JSON_entry" onChange={(e)=> this.setState({layoutJSON : e.target.value.toString()})}></input>    
            </div>
        )
    }
}

export default JSONEntrySidebarContent


/*
[ // hardcoded data
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
        },]







*/