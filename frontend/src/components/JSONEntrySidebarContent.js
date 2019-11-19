import React, { Component } from 'react'
import './JSONEntrySidebarContent.css'
import { connect } from 'react-redux';
import { replaceNodeList } from '../redux/actions'

export class JSONEntrySidebarContent extends Component {
    constructor(props){
        super(props)
        this.state = {valid: true}
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
                <textarea rows="30" name="JSON_entry" onChange={(e) => this.setState({valid: true, layoutJSON : e.target.value.toString()})}></textarea>    
                </div>
                <button className="SubmitJSONButton" onClick={(e) => this.handleSubmit(e)}>Submit</button>
                <div className="JSONWarningContainer">
                    <label className="JSONWarningText">{this.state.valid ? "" : "  Invalid JSON"}</label>
                </div>
                
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { }
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







