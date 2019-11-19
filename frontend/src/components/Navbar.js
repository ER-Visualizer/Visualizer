import React from 'react';
import "./Navbar.css";
import { connect } from 'react-redux';
import  {showLogs, showNodeConfig, showJSONEntrySidebar, addNode, deleteLinkModeSwitch } from '../redux/actions'
import {ReactComponent as PlayIcon} from '../play.svg';
import {ReactComponent as TerminalIcon} from '../terminal.svg';
import {ReactComponent as JSONIcon} from '../json.svg';
import {ReactComponent as NodeIcon} from '../nodeicon.svg';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        
        this.sendCanvas = this.sendCanvas.bind(this);
        this.updateRunButton = this.updateRunButton.bind(this);
        this.handleLinkDeleteButton = this.handleLinkDeleteButton.bind(this)
        this.state = {runButtonpressed: false};
    }

    async sendCanvas(e){
        try {
            console.log("send canvas");
            
            let response = await fetch('http://localhost:8000/start', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                mode: 'no-cors',
                body: JSON.stringify(this.props.nodes),
            });
            console.log(response);
            // let responseJson = await response.body.json();
            // console.log({responseJson});
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    updateRunButton(e){
        e.target.classList.add("clickedRunButton")     
    }

    handleLinkDeleteButton(e){
        this.props.deleteLinkModeSwitch()
    }

    

    render() {
        return (
            <div className="Navbar">   
                <button className="ToggleLinkDeletebutton" onClick={(e) => this.handleLinkDeleteButton(e)}>Delete Links: { this.props.shouldDeleteLink? "on" : "off" }</button>
                {/* <button className="AddLinkButton" onClick={()=>console.log("adding links not implemented")}>Add Link</button> */}
                <button className="AddNodebutton" onClick={this.props.addNode}><NodeIcon/> Add Node</button>
                <button className="ShowLogsButton" onClick={this.props.showLogs}><TerminalIcon /> Show Logs</button>
                <button className="JSONEntryButton" onClick={this.props.showJSONEntry}> <JSONIcon/> JSON Entry </button>  
                <button className="RunButton" onClick={(e) => {this.sendCanvas(e); this.updateRunButton(e)}}><PlayIcon /> Run</button>              
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { nodes: state.nodes, shouldDeleteLink: state.shouldDeleteLink}
}
  
const mapDispatchToProps = dispatch => {
    
    
    return {
        showLogs: () => {
            dispatch(showLogs())
        },
        showNodeConfig: () => {
            dispatch(showNodeConfig())
        },
        showJSONEntry: () => {
            dispatch(showJSONEntrySidebar())
        },
        addNode: () => {
            dispatch(addNode())
        },
        deleteLinkModeSwitch: () =>{
            dispatch(deleteLinkModeSwitch())
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar)