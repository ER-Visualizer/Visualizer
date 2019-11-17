import React from 'react';
import './NodeSidebarContent.css';

class NodeSidebarContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = this.props.data
        console.log("NODESIDEBAR")
        console.log(this.props.data)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange(event) {
        const name = event.target.name
        const value = event.target.value

        this.setState({
            [name]: value
        })

        console.log(this.state);
    }

    render() {
        return (
            <div className="NodeSidebarContent">                
                <h3>{this.props.data.elementType}</h3>
                
                <div className="input-container">
                    <label>Finish time</label><br/>
                    <input type="text" 
                        name="distribution_raw"
                        value={`${this.state.distribution}(mean=${this.state.distributionParameters[0]}, variance=${this.state.distributionParameters[1]})`}
                        onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Number of actors</label><br/>
                    <input 
                        type="text"
                        name="number_of_actors"
                        value={this.state.numberOfActors} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Queue type</label><br/>
                    <input type="text"
                        name="queue_type"
                        value={this.state.queueType} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Priority Function</label><br/>
                    <input 
                        type="text"
                        name="priority_function"
                        value={this.state.priorityFunction} onChange={this.handleInputChange}></input>
                </div>

            </div>
        )
    }
}

export default NodeSidebarContent