import React from 'react';
import './NodeSidebarContent.css';
import { connect } from 'react-redux';
import { editNodeProperties } from '../redux/actions'

export class NodeSidebarContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = this.props.data // copy the node, in case we make changes
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
        
        // console.log(this.state);
    }

    // {
    //     "id": nodeNum,
    //     "elementType": "newNode",
    //     "distribution": "",
    //     "distributionParameters": [],
    //     "numberOfActors": 0,
    //     "queueType": "",
    //     "priorityFunction": "",
    //     "children": []
    // })

    render() {
        return (
            <div className="NodeSidebarContent">                
                <h3>{this.props.data.elementType}</h3>
                
                <div className="input-container">
                    <label>Finish time</label><br/>
                    <input type="text" 
                        name="distribution"
                        value={this.state.distribution}
                        onChange={this.handleInputChange}></input>
                </div>

                <div>
                <label>Mean</label><br/>
                    <input type="text" 
                        name="mean"
                        value={this.state.distributionParameters[0]}
                        onChange={this.handleInputChange}></input>

                </div>

                <div>
                <label>Variance</label><br/>
                    <input type="text" 
                        name="mean"
                        value={this.state.distributionParameters[1]}
                        onChange={this.handleInputChange}></input>

                </div>

                <div className="input-container">
                    <label>Number of actors</label><br/>
                    <input 
                        type="text"
                        name="numberOfActors"
                        value={this.state.numberOfActors} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Queue type</label><br/>
                    <input type="text"
                        name="queueType"
                        value={this.state.queueType} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Priority Function</label><br/>
                    <input 
                        type="text"
                        name="priorityFunction"
                        value={this.state.priorityFunction} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Station Type</label><br/>
                    <input 
                        type="text"
                        name="elementType"
                        value={this.state.elementType} onChange={this.handleInputChange}></input>
                </div>

                <div className="saveButton">
                    <button onClick={()=>console.log("save node")}>Save Changes</button> {/* TODO: style this button */}
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return {
        editNodeProperties: () => {
            dispatch(editNodeProperties())
        }
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NodeSidebarContent)

// export default NodeSidebarContent