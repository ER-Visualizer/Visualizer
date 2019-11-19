import React from 'react';
import './NodeSidebarContent.css';

class NodeSidebarContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {node:null}
        this.state.node = this.props.node 
        console.log("NODESIDEBAR")
        console.log(this.props.node)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleInputChange(event) {
        const name = event.target.name
        const value = event.target.value

        this.setState({
            [name]: value
        })

        
    }

    componentWillReceiveProps({node}){
        // this.state.node=node;
        // this.replaceState({state: node});
        this.setState({node:node})
    }

    render() {
        
        
        return (
            <div className="NodeSidebarContent">                
                <h3>{this.state.node.elementType}</h3>
                
                <div className="input-container">
                    <label>Finish time</label><br/>
                    <input type="text" 
                        name="distribution_raw"
                        value={`${this.state.node.distribution}(mean=${this.state.node.distributionParameters[0]}, variance=${this.state.node.distributionParameters[1]})`}
                        onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Number of actors</label><br/>
                    <input 
                        type="text"
                        name="number_of_actors"
                        value={this.state.node.numberOfActors} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Queue type</label><br/>
                    <input type="text"
                        name="queue_type"
                        value={this.state.node.queueType} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Priority Function</label><br/>
                    <input 
                        type="text"
                        name="priority_function"
                        value={this.state.node.priorityFunction} onChange={this.handleInputChange}></input>
                </div>

            </div>
        )
    }
}

export default NodeSidebarContent