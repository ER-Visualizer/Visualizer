import React from 'react';
import './NodeSidebarContent.css';

class NodeSidebarContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = this.props.data

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
                <h3>{this.props.data.Element_type}</h3>
                
                <div className="input-container">
                    <label>Finish time</label><br/>
                    <input type="text" 
                        name="distribution_raw"
                        value={`${this.state.Distribution}(mean=${this.state.Distribution_parameters[0]}, variance=${this.state.Distribution_parameters[1]})`}
                        onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Number of actors</label><br/>
                    <input 
                        type="text"
                        name="number_of_actors"
                        value={this.state.Number_of_actors} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Queue type</label><br/>
                    <input type="text"
                        name="queue_type"
                        value={this.state.Queue_type} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Priority Function</label><br/>
                    <input 
                        type="text"
                        name="priority_function"
                        value={this.state.Priority_function} onChange={this.handleInputChange}></input>
                </div>

            </div>
        )
    }
}

export default NodeSidebarContent