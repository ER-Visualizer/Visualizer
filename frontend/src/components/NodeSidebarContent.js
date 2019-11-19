import React from 'react';
import './NodeSidebarContent.css';
import { connect } from 'react-redux';
import { editNodeProperties } from '../redux/actions'

export class NodeSidebarContent extends React.Component {
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
        const value = name !== "distributionParameters" ? event.target.value : event.target.value.split(",")
        // user enters csvs for distribution parameters box. e.g. 5,3,6

        
        let new_node = Object.assign({}, this.state.node, {[name]: value})
        this.setState({
            node: new_node
        })
    }

    componentWillReceiveProps({node}){ 
        this.setState({node:node})
    }

    
    render() {
        return (
            <div className="NodeSidebarContent">                
                
                <div className="input-container"> {/* could make this a dropdown. */ }
                    <label>Station Type</label><br/>
                    <input 
                        type="text"
                        name="elementType"
                        value={this.state.node.elementType} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Finish time</label><br/>
                    <input type="text" 
                        name="distribution"
                        value={`${this.state.node.distribution}`}
                        onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container"> {/* could indicate what parameters required */}
                    <label>Distribution Parameters</label><br/> 
                    <input 
                        type="text"
                        name="distributionParameters"
                        value={this.state.node.distributionParameters} onChange={this.handleInputChange}></input>
                </div>
                

                <div className="input-container">
                    <label>Number of actors</label><br/>
                    <input 
                        type="text"
                        name="numberOfActors"
                        value={this.state.node.numberOfActors} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Queue type</label><br/>
                    <input type="text"
                        name="queueType"
                        value={this.state.node.queueType} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Priority Function</label><br/>
                    <input 
                        type="text"
                        name="priorityFunction"
                        value={this.state.node.priorityFunction} onChange={this.handleInputChange}></input>
                </div>

                <button onClick={()=>{this.props.editNodeProperties(this.state.node)}}> Save </button>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return {
        editNodeProperties: (node) => {
            dispatch(editNodeProperties(node))
        }
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NodeSidebarContent)

// export default NodeSidebarContent