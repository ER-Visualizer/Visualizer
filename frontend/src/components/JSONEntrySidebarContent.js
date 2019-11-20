import React, { Component } from 'react'
import './JSONEntrySidebarContent.css'
import { connect } from 'react-redux';
import { replaceNodeList } from '../redux/actions'
import { func } from 'prop-types';

export class JSONEntrySidebarContent extends Component {
    constructor(props) {
        super(props)
        this.state = { valid: true, layoutJSON: "" }
        this.handleReset = this.handleReset.bind(this)
        this.handleClear = this.handleClear.bind(this)
    }

    componentDidMount() {
        if (this.state.layoutJSON !== this.props.nodes) {
            this.handleReset()
        }
    }

    handleReset() {
        this.setState({ layoutJSON: JSON.stringify(this.props.nodes, null, 1), valid: true })
    }


    handleSubmit(e) {
        let validatedJSON

        try {
            validatedJSON = JSON.parse(this.state.layoutJSON)
        } catch (e) {
            this.state.valid = false
            return
        }
        
        if (!validatedJSON.length) {
            this.setState({ valid: false })
            return
        } 
        
        const requiredKeys = ["id", "elementType", "distribution", "distributionParameters", "numberOfActors", "queueType", "priorityFunction", "children"];
       
        for (let i = 0; i < validatedJSON.length; i++) {
            let node = validatedJSON[i]
    
            let hasAllProps = requiredKeys.every(function(item){
                return node.hasOwnProperty(item);
            });
            
            if (!hasAllProps) {
                this.setState({ valid: false })
                return
            }
        }

        if (this.state.valid) {
            this.props.replaceNodeList(validatedJSON)
        }
    }
    
    handleClear(e) {
        this.setState({ layoutJSON: "", valid: true })
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
                <div className="JSONWarningContainer">
                    <label className="JSONWarningText">{this.state.valid ? "" : "  Invalid Entry "}</label>
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







