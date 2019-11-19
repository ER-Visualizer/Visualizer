import React, { Component } from 'react'
import './JSONEntrySidebarContent.css'

class JSONEntrySidebarContent extends Component {

    render() {
        return (
            <div className="JSONEntrySidebarContent">
                <label>Layout JSON</label><br/>
                <div>
                <textarea rows="50" name="JSON_entry" onChange={(e)=> this.setState({layoutJSON : e.target.value.toString()})}></textarea>    
                </div>
                
            </div>
        )
    }
}

export default JSONEntrySidebarContent







