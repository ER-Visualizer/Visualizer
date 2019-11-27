import React from 'react';
import "./Navbar.css";
import { connect } from 'react-redux';
import  {showLogs, showNodeConfig, showJSONEntrySidebar, addNode, deleteLinkModeSwitch, buildLinkModeSwitch } from '../redux/actions'
import {ReactComponent as PlayIcon} from '../play.svg';
import {ReactComponent as TerminalIcon} from '../terminal.svg';
import {ReactComponent as JSONIcon} from '../json.svg';
import {ReactComponent as NodeIcon} from '../nodeicon.svg';
import FileUploadForm from './UploadButton.js'

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        
        this.sendCanvas = this.sendCanvas.bind(this);
        this.updateRunButton = this.updateRunButton.bind(this);
        this.handleLinkDeleteButton = this.handleLinkDeleteButton.bind(this)
        this.state = {runButtonpressed: false, button: null};
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }
    async sendCanvas(e){
        try {
            console.log("send canvas");
            // console.log(e)
            await this.setState({button: e.target}, this.updateRunButton)
            this.props.runHandler()
            let body = {nodes: this.props.nodes, duration: this.props.duration, rate: this.props.rate}
            console.log(body)
            let response = await fetch('http://localhost:' + process.env.REACT_APP_SERVER_PORT + '/start', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    async updateRunButton(){
        // console.log("updateRunButton")
        // console.log(this.state.runButtonpressed, this.state.button)
        if(this.state.button == null){
            return;
        }
        if(this.state.runButtonpressed){
            this.state.button.classList.remove("clickedRunButton")
        }else{
            this.state.button.classList.add("clickedRunButton")

        }
        this.setState({runButtonpressed: !this.state.runButtonpressed})
    }
    // async clickHandler(e){

    // }
    handleLinkDeleteButton(e){
        this.props.deleteLinkModeSwitch()
    }

    render() {
        return (
            <div className="Navbar">   
                <FileUploadForm className="FileUploadButton"> </FileUploadForm>
                <button className="ToggleLinkDeletebutton" onClick={this.props.deleteLinkModeSwitch}>Delete Links: { this.props.shouldDeleteLink? "on" : "off" }</button>
                <button className="ToggleBuildLinksbutton" onClick={this.props.buildLinkModeSwitch}>Build Links: { this.props.shouldBuildLink? "on" : "off" }</button>
                <button className="AddNodebutton" onClick={this.props.addNode}><NodeIcon/> Add Node</button>
                <button className="ShowLogsButton" onClick={this.props.showLogs}><TerminalIcon /> Show Logs</button>
                <button className="JSONEntryButton" onClick={this.props.showJSONEntry}> <JSONIcon/> JSON Entry </button>  
                <button className="RunButton" onClick={async (e) => {await this.sendCanvas(e);}}><PlayIcon /> Run</button>              
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { nodes: state.nodes, shouldDeleteLink: state.shouldDeleteLink, shouldBuildLink: state.shouldBuildLink}
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
        deleteLinkModeSwitch: () => {
            dispatch(deleteLinkModeSwitch())
        },
        buildLinkModeSwitch: () => {
            dispatch(buildLinkModeSwitch())
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar)