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







