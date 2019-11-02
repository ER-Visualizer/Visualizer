import React from 'react';
import './SidebarContent.css';

class SidebarContent extends React.Component {
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
    }

    render() {
        return (
            <div className="SidebarContent">                
                <h3>{this.props.data.element_type}</h3>
                
                <div className="input-container">
                    <label>Finish time</label><br/>
                    <input type="text" 
                        name="distribution_raw"
                        value={`${this.state.distribution}(mean=${this.state.distribution_parameters.mean}, variance=${this.state.distribution_parameters.variance})`}
                        onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Number of actors</label><br/>
                    <input 
                        type="text"
                        name="number_of_actors"
                        value={this.state.number_of_actors} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Queue type</label><br/>
                    <input type="text"
                        name="queue_type"
                        value={this.state.queue_type} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Priority Function</label><br/>
                    <input 
                        type="text"
                        name="priority_function"
                        value={this.state.priority_function} onChange={this.handleInputChange}></input>
                </div>

            </div>
        )
    }
}

export default SidebarContent