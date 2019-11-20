import React from 'react';
import './NodeSidebarContent.css';
import { connect } from 'react-redux';
import { editNodeProperties, deleteNode } from '../redux/actions'

export class NodeSidebarContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {node:null, numNodes:null}
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

    componentWillReceiveProps({node, numNodes}){  // TODO: not use this function
        this.setState({node:node, numNodes: numNodes})
    }

    
    handleDelete(){
        if (!(this.state.numNodes === 1)){
            this.props.deleteNode(this.state.node.id)
        }
        else {
            console.log("cannot delete last node");
        }
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
                    <label>Distribution Type</label><br/>
                    <select name="distribution"
                            value={`${this.state.node.distribution}`}
                            onChange={this.handleInputChange}>
                        <option value="normal">Normal/Gaussian</option>
                        <option value="beta">Beta</option>
                        <option value="binomial">Binomial</option>
                        <option value="chisquare">Chisquare</option>
                        <option value="dirichlet">Dirichlet</option>
                        <option value="exponential">Exponential</option>
                        <option value="f">F</option>
                        <option value="fixed">Fixed</option>
                        <option value="gamma">Gamma</option>
                        <option value="geometric">Geometric</option>
                        <option value="gumbel">Gumbel</option>
                        <option value="hypergeometric">Hypergeometric</option>
                        <option value="laplace">Laplace</option>
                        <option value="logistic">Logistic</option>
                        <option value="lognormal">Lognormal</option>
                        <option value="logseries">Logseries</option>
                        <option value="multinomial">Multinomial</option>
                        <option value="multivariate_normal">Multivariate Normal</option>
                        <option value="negative_binomial">Negative Binomial</option>
                        <option value="noncentral_chisquare">Noncentral Chisquare</option>
                        <option value="noncentral_f">Noncentral F</option>
                        <option value="pareto">Pareto</option>
                        <option value="poisson">Poisson</option>
                        <option value="power">Power</option>
                        <option value="rayleigh">Rayleigh</option>
                        <option value="standard_cauchy">Standard Cauchy</option>
                        <option value="standard_exponential">Standard Exponential</option>
                        <option value="standard_gamma">Standard Gamma</option>
                        <option value="standard_normal">Standard Normal</option>
                        <option value="standard_t">Standard T</option>
                        <option value="triangular">Triangular</option>
                        <option value="uniform">Uniform</option>
                        <option value="vonmises">Vonmises</option>
                        <option value="wald">Wald</option>
                        <option value="weibull">Weibull</option>
                        <option value="zipf">Zipf</option>
                    </select>
                </div>

                <div className="input-container"> {/* could indicate what parameters required */}
                    <label>Distribution Parameters</label><br/> 
                    <input 
                        type="text"
                        name="distributionParameters"
                        value={this.state.node.distributionParameters} onChange={this.handleInputChange}></input>
                </div>
                

                <div className="input-container">
                    <label>Number of Actors</label><br/>
                    <input 
                        type="text"
                        name="numberOfActors"
                        value={this.state.node.numberOfActors} onChange={this.handleInputChange}></input>
                </div>

                <div className="input-container">
                    <label>Queue Type</label><br/>
                    <select name="queueType"
                            value={`${this.state.node.queueType}`}
                            onChange={this.handleInputChange}>
                        <option value="priority queue">Priority Queue</option>
                        <option value="queue">Queue</option>
                        <option value="stack">Stack</option>
                    </select>
                </div>

                <div className="input-container">
                    <label>Priority Type</label><br/>
                    <select name="priorityFunction"
                            value={`${this.state.node.priorityFunction}`}
                            onChange={this.handleInputChange}>
                        <option value="acuity">Acuity</option>
                        <option value="arrival time">Arrival Time</option>
                    </select>
                </div>

                {/* <div className="input-container">
                    <label>Priority Function</label><br/>
                    <input 
                        type="text"
                        name="priorityFunction"
                        value={this.state.node.priorityFunction} onChange={this.handleInputChange}></input>
                </div> */}
                
                <button className="SaveNodebutton" onClick={()=>{this.props.editNodeProperties(this.state.node)}}> Save </button>
                <button className="DeleteNodebutton" onClick={()=>{this.handleDelete()}}> Delete </button>
            </div> // TODO: make deleting close the sidebar 
        )
    }
}

const mapStateToProps = state => {}

const mapDispatchToProps = dispatch => {
    return {
        editNodeProperties: (node) => {
            dispatch(editNodeProperties(node))
        },
        deleteNode: (nodeId) => {
            dispatch(deleteNode(nodeId))
        }
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NodeSidebarContent)

// export default NodeSidebarContent