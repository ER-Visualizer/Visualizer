import React, { Component } from 'react'
import './JSONEntrySidebarContent.css'
import { connect } from 'react-redux';
import { replaceNodeList } from '../redux/actions'

export class JSONEntrySidebarContent extends Component {
    constructor(props){
        super(props)
        this.state = {valid: true, JSONmodified: false, layoutJSON:""}
        this.handleReset = this.handleReset.bind(this)
    }

    componentDidMount(){
        if (this.state.layoutJSON !== this.props.nodes){
            this.handleReset()
        }
    }

    handleReset(){  
        this.setState({layoutJSON: JSON.stringify(this.props.nodes, null, 2)})
    }
    

    handleSubmit(e){
        try {
            let validatedJSON = JSON.parse(this.state.layoutJSON)
            this.props.replaceNodeList(validatedJSON)
        } catch(e){
            this.setState({valid: false})
        }

    }

    render() {
        return (
            <div className="JSONEntrySidebarContent">
                <label>Layout JSON</label><br/>
                <div>
                <textarea rows="30" name="JSON_entry" value={this.state.layoutJSON} onChange={(e) => this.setState({valid: true, layoutJSON : e.target.value.toString()})}></textarea>    
                </div>
                <button className="SubmitJSONButton" onClick={(e) => this.handleSubmit(e)}>Submit</button>
                <button className="ResetJSONButton" onClick={this.handleReset}>Reset</button>
                <div className="JSONWarningContainer">
                    <label className="JSONWarningText">{this.state.valid ? "" : "  Invalid JSON"}</label>
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







