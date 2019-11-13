import React from 'react';
import "./Navbar.css";
import { connect } from 'react-redux';
import  {showLogs, showNodeConfig, showJSONEntrySidebar } from '../redux/actions'
import {ReactComponent as PlayIcon} from '../play.svg';
import {ReactComponent as TerminalIcon} from '../terminal.svg';
import {ReactComponent as JSONIcon} from '../json.svg';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.sendCanvas = this.sendCanvas.bind(this);
        this.updateRunButton = this.updateRunButton.bind(this);
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
        e.target.classList.add("clickedButton")     
    }
    render() {
        return (
            <div className="Navbar">   
                <button className="ShowLogsButton" onClick={this.props.showLogs}><TerminalIcon /> Show Logs</button>
                <button className="JSONEntryButton" onClick={this.props.showJSONEntry}> <JSONIcon/> JSON Entry </button>  
                <button className="RunButton" onClick={(e) => {this.sendCanvas(e); this.updateRunButton(e)}}><PlayIcon /> Run</button>          
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { nodes: state.nodes }
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
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar)