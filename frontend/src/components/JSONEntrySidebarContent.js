import React, { Component } from 'react'
import './JSONEntrySidebarContent.css'
import { connect } from 'react-redux';
import { replaceNodeList } from '../redux/actions'

export class JSONEntrySidebarContent extends Component {

    render() {
        return (
            <div className="JSONEntrySidebarContent">
                <label>Layout JSON</label><br/>
                <div>
                <textarea rows="30" name="JSON_entry" onChange={(e)=> this.setState({layoutJSON : e.target.value.toString()})}></textarea>    
                </div>
                <button onClick={() => this.props.replaceNodeList(JSON.parse(this.state.layoutJSON))}>Submit</button>
                
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







