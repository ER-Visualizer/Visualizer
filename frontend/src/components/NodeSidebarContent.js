import React from 'react';
import './NodeSidebarContent.css';
import { connect } from 'react-redux';
import { editNodeProperties, deleteNode } from '../redux/actions'
import NodeRule from './NodeRule';
import ResourceRule from './ResourceRule';
import {ReactComponent as AddIcon} from '../add.svg';
import Queue from './Queue';
import ResourceQueue from './ResourceQueue';

const stationTypes = ["reception", "triage", "doctor", "x-ray"];

export class NodeSidebarContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            node:null,
            numNodes:null,
            showOther: false,
            tempText: '',
        };
        this.state.node = this.props.node;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRuleChange = this.handleRuleTypeChange.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.addNewNodeRule = this.addNewNodeRule.bind(this);
        this.addNewResourceRule = this.addNewResourceRule.bind(this);
        this.handleColumnNameChange = this.handleColumnNameChange.bind(this);
        this.removeRule = this.removeRule.bind(this);
    }

    handleInputChange(event) {
        const name = event.target.name
        const value = name !== "distributionParameters" ? event.target.value : event.target.value.split(",").map(item => item.trim());
        // user enters csvs for distribution parameters box. e.g. 5,3,6

        
        let new_node = Object.assign({}, this.state.node, {[name]: value})
        if(new_node.queueType != "priority queue"){
            new_node.priorityFunction = ""
            new_node.priorityType = ""
        }

        // Empty the text inside the "other" field
        if (name === "elementType" && value === "other") {
            this.setState({ tempText: "" });
        }

        this.setState({
            node: new_node
        })
    }

    handleTextInputChange(event) {
        this.setState({ tempText: event.target.value });
    }

    addNewNodeRule() {
        const rules = [...this.state.node.nodeRules];
        rules.push({ "ruleType": "", "columnName": "" });
        let new_node = Object.assign({}, this.state.node, {nodeRules: rules});
        this.setState({
            node: new_node
        });
    }

    addNewResourceRule() {
        const rules = [...this.state.node.resourceRules];
        rules.push({ "ruleType": "" });
        let new_node = Object.assign({}, this.state.node, {resourceRules: rules});
        this.setState({
            node: new_node
        });
    }

    handleRuleTypeChange(event, i) {
        const name = event.target.name;
        const value = event.target.value;

        const rules = [...this.state.node[name]];
        rules[i] = {...rules[i], ruleType: value};
        let new_node = {...this.state.node, [name]: rules};

        this.setState({
            node: new_node
        });
    }

    handleColumnNameChange(event, i) {
        const value = event.target.value;

        const rules = [...this.state.node.nodeRules];
        rules[i] = {...rules[i], columnName: value};
        let new_node = {...this.state.node, nodeRules: rules};

        this.setState({
            node: new_node
        });
    }

    removeRule(name, i) {
        const rules = [...this.state.node[name]];
        rules.splice(i, 1);
        let new_node = {...this.state.node, [name]: rules};

        this.setState({
            node: new_node
        });
    }

    componentWillReceiveProps({node, numNodes}){  
        this.setState({node:node, numNodes: numNodes})
    }

    
    handleDelete(){
        if (this.state.numNodes !== 1){
            const deleteId = this.state.node.id
            const numNodes = this.props.numNodes

            this.props.deleteNode(deleteId)
            
            for (let i = deleteId; i < numNodes; i++) {
                continue
            }

        }
        else {
            console.log("cannot delete last node");
        }
    }


    render() {
        console.log(this.state.node);
        const NodeRules = this.state.node.nodeRules.map((rule, i) =>
            <NodeRule
                key={i}
                ruleType={rule.ruleType}
                columnName={rule.columnName}
                onDropdownChange={(e) => this.handleRuleTypeChange(e, i)}
                onInputChange={(e) => this.handleColumnNameChange(e, i)}
                removeRule={() => this.removeRule("nodeRules", i)}
            />
        );

        const ResourceRules = this.state.node.resourceRules.map((rule, i) =>
            <ResourceRule
                key={i}
                ruleType={rule.ruleType}
                onDropdownChange={(e) => this.handleRuleTypeChange(e, i)}
                removeRule={() => this.removeRule("resourceRules", i)}
            />
        );
        

        return (
            <div className="NodeSidebarContent">                
                
                <div className="input-container"> 
                    <label>Station Type</label><br/>
                    <select name="elementType"
                            value={stationTypes.includes(this.state.node.elementType) ? 
                                this.state.node.elementType : "other"}
                            onChange={this.handleInputChange}>
                        <option value="reception">Reception</option>
                        <option value="triage">Triage</option>
                        <option value="doctor">Doctor</option>
                        <option value="x-ray">X-ray</option>
                        <option value="other">Other</option>
                    </select>
                    {!stationTypes.includes(this.state.node.elementType) &&
                        <input 
                            type="text"
                            name="elementType"
                            placeholder="Station Type"
                            value={this.state.tempText}
                            onChange={this.handleTextInputChange}
                            onBlur={this.handleInputChange}>
                        </input>
                    }
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

                {this.state.node != null && this.state.node.queueType == 'priority queue' && 
                <div className="input-container">
                    <label>Priority Type</label><br/>
                    <select name="priorityType"
                            value={`${this.state.node.priorityType}`}
                            onChange={this.handleInputChange}>
                        <option value="acuity">Lowest Acuity</option>
                        <option value="arrival time">Earliest Arrival Time</option>
                        <option value="custom">Define Your Own</option>
                    </select>
                    {this.state.node.priorityType == 'custom' &&
	                    <div>
	                    <label>Priority Function</label><br/><br/>
                        <div style={{display: "inline-block"}}>def <div style={{color: '#F2870C', display: "inline-block"}}> _calculate_priority_value(patient):</div><br/></div>
                        <div style={{color: 'green', marginLeft: '20px'}}>
                        """<br/>
                        Calculate a priority value representing a patient's priority within the priority queue<br/><br/>

                        Attributes available:<br/>
                        patient.get_acuity() <br/> Returns a integer value of the patient's acuity<br/><br/>
                        patient.get_start_time() <br/> Returns the number of minutes it took for patient to enter the simulation
                        after the simulation started.<br/><br/>
                        patient.get_attribute(attribute) <br/> Returns the value of the attribute for the patient as indicated by the uploaded CSV
                        <br/><br/>
                        """
                        </div>
                        <br/>
                        <div style={{marginLeft: '20px'}}>
                        _p_value = 0<br/>
                        <div style={{color: 'grey'}}> # Set _p_value to the priority you want to return <br/>
                        # DO NOT RETURN ANYTHING IN THE CODE <br/></div>
                        </div>
	                    <textarea 
	                        type="text"
	                        name="priorityFunction"
                            style={{marginLeft: '20px', width: '80%', fontSize: '15px'}}
	                        value={this.state.node.priorityFunction} onChange={this.handleInputChange}></textarea>
	                     </div>
                 }
                </div>
            	}
                <div className="input-container">
                    <div className="add-remove-container">
                        <label>Node Rules</label><br/>
                        <AddIcon className="RuleIcon" onClick={this.addNewNodeRule} />
                    </div>
                    {NodeRules}
                </div>

                <div className="input-container">
                    <div className="add-remove-container">
                        <label>Resource Rules</label><br/>
                        <AddIcon className="RuleIcon" onClick={this.addNewResourceRule} />
                    </div>
                    {ResourceRules}
                </div>
                
                <div className="input-container">
                    <label>Currently being proccessed by actor</label><br/>
                    <ResourceQueue patients={this.state.node.processing} />
                </div>
                <div className="input-container">
                    <label>Current Queue</label><br/>
                    <Queue patients={this.state.node.patients} />
                </div>

                
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