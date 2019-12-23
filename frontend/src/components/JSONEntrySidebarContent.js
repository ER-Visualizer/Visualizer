import React, { Component } from 'react'
import './JSONEntrySidebarContent.css'
import { connect } from 'react-redux';
import { replaceNodeList } from '../redux/actions'
const Validator = require('jsonschema').Validator;
const v = new Validator();
const nodeSchema = {
    "type": "object",
    "properties": {
        "id": { "type": "integer"},
        "elementType": { "type": "string"},
        "distribution": {"type": "string"},
        "distributionParameters": {"type": "array", "items": {"type": "integer"}},
        "numberOfActors": { "type": "integer"},
        "queueType": { "type": "string"},
        "priorityFunction": { "type": "string"},
        "children": {"type": "array", "items": {"type": "integer"}},
        "priorityType": { "type": "string"},
        "predictedChildren": {"type": "array", "items": {"type": "integer"}},
        "nodeRules": {"type": "array", "items": {"type": "object", "properties": {
                "ruleType": {"type": "string"},
                "columnName": {"type": "string"}
            }
        }},
        "resourceRules": {"type": "array", "items": {"type": "object", "properties": {
                "ruleType": {"type": "string"}
            }
        }},
        "resourceRules": {"type": "array"},
        "x": { "type": "float"},
        "y":{ "type": "float"}
    }
   };

export class JSONEntrySidebarContent extends Component {
    constructor(props) {
        super(props)
        this.state = { valid: true, layoutJSON: "" , invalidJSONError: ""}
        this.handleReset = this.handleReset.bind(this)
        this.handleClear = this.handleClear.bind(this)
        this.handleDownload = this.handleDownload.bind(this)
        this.cloneNodes = this.cloneNodes.bind(this)

    }

    componentDidMount() {

        if (this.state.layoutJSON !== this.cloneNodes(this.props.nodes)) {
            this.handleReset(this.props.nodes)
        }
    }

    componentWillReceiveProps(newProps) {
        this.handleReset(newProps.nodes);
    }

    cloneNodes(nodes){
        let clone = JSON.stringify(nodes, null, 1)
        clone = JSON.parse(clone)
        for(let i = 0; i < clone.length; i ++){
            delete clone[i].patients
            delete clone[i].processing
        }
        return clone
    }
    handleReset(nodes) {
        this.setState({ layoutJSON: JSON.stringify(this.cloneNodes(nodes), null, 1), valid: true })
    }


    handleSubmit(e) {
        let validatedJSON

        try {
            validatedJSON = JSON.parse(this.state.layoutJSON)
        } catch (e) {
            this.setState({valid: false, invalidJSONError: "Invalid JSON syntax"})
            return
        }
        
        if (!validatedJSON.length) {
            this.setState({ valid: false, invalidJSONError: "Enter at least 1 node" })
            return
        }
        for(let j = 0; j < validatedJSON.length; j++){
            if (validatedJSON[j].queueType == "priority queue" && validatedJSON[j].priorityType == ""){
                this.setState({ valid: false, invalidJSONError: "Process with priority queue does not have a priorityType!" })
                return 
            }
            else if (validatedJSON[j].queueType == "priority queue" && validatedJSON[j].priorityType == "custom" && (validatedJSON[j].priorityFunction).trim() == ""){
                this.setState({ valid: false, invalidJSONError: "Process with custom priority queue's priority function is empty!" })
                return 
            }
            else if (validatedJSON[j].queueType == "priority queue" && validatedJSON[j].priorityType == "custom" && (validatedJSON[j].priorityFunction).indexOf("_p_value") == -1){
                this.setState({ valid: false, invalidJSONError: "_p_value isn't set in priority function!" })
                return 
            }
            else if (validatedJSON[j].queueType == "priority queue" && validatedJSON[j].priorityType == "custom" && (validatedJSON[j].priorityFunction).indexOf("return ") != -1){
                this.setState({ valid: false, invalidJSONError: "Do not return anything in a priority function!" })
                return 
            }
        }
        for(let i = 0; i < validatedJSON.length; i++){
            validatedJSON[i].patients = []
            validatedJSON[i].processing = []
        }
        const requiredKeys = ["id", "elementType", "distribution", "distributionParameters", "numberOfActors", "queueType", "priorityFunction", "children", "priorityType"];
        // console.log(this.state.valid);
       
        for (let i = 0; i < validatedJSON.length; i++) {
            let node = validatedJSON[i]
    
            let hasAllProps = requiredKeys.every(function(item){
                return node.hasOwnProperty(item);
            });
            
            if (!hasAllProps) {
                this.setState({ valid: false, invalidJSONError: "Node(s) missing a required property" })
                return
            }
        }
        let errors = ""
        for (let i = 0; i < validatedJSON.length; i++) {
            let node = validatedJSON[i]
            let valid = v.validate(node, nodeSchema);
            console.log(valid.errors);
            
            if (valid.errors.length === 0) {
                console.log('User data is valid');
            } else {
                console.log('User data is INVALID!');
                console.log(valid.errors);
                
                for (let j = 0; j < valid.errors.length; j++) {
                    errors += valid.errors[j]
                    errors += "\n       "
                }
                // `${valid.errors}`
            }
        }        
        if (errors !== ""){
            this.setState({ valid: false, 
                invalidJSONError: errors})
            return
        }

        if (this.state.valid) {
            this.props.replaceNodeList(validatedJSON)
        }
    }
    
    handleClear(e) {
        this.setState({ layoutJSON: "", valid: true })
    }

    handleDownload(filename, nodes) {
        let copy = this.cloneNodes(nodes)
        let text = JSON.stringify(copy, null, 1)
        var element = document.createElement('a');
        element.setAttribute('href', 'data:json/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
    }

    render() {
        return (
            <div className="JSONEntrySidebarContent">
                <label>Layout JSON</label><br />
                <div>
                    <textarea rows="40" name="JSON_entry" value={this.state.layoutJSON} onChange={(e) => this.setState({ valid: true, layoutJSON: e.target.value.toString() })}></textarea>
                </div>
                <button className="SubmitJSONButton" onClick={(e) => this.handleSubmit(e)}>Submit</button>
                <button className="ResetJSONButton" onClick={this.handleReset}>Reset</button>
                <button className="ClearJSONButton" onClick={this.handleClear}>Clear</button>
                <button className="DownloadJSONButton" onClick={()=>this.handleDownload("nodes.json", this.props.nodes)}>Download</button> 
                <div className="JSONWarningContainer">
                    <label className="JSONWarningText">{this.state.valid ? "" : this.state.invalidJSONError}</label> 
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return { nodes: state.nodes }
}

const mapDispatchToProps = dispatch => {
    return {
        replaceNodeList: (newNodeList) =>
            dispatch(replaceNodeList(newNodeList))
    }
}



export default connect(
    mapStateToProps,
    mapDispatchToProps
)(JSONEntrySidebarContent)







