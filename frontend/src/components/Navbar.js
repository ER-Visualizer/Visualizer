import React from 'react';
import "./Navbar.css";
import { connect } from 'react-redux';
import  {showLogs, showNodeConfig, showJSONEntrySidebar } from '../redux/actions'
import {ReactComponent as PlayIcon} from '../play.svg';
import {ReactComponent as TerminalIcon} from '../terminal.svg';
import {ReactComponent as JSONIcon} from '../json.svg';
import post from 'axios';

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.sendCanvas = this.sendCanvas.bind(this)
    }

    isValidJSON = (json) => {
        try {
            JSON.parse(this.state.layoutJSON);
            return true;
        } catch (e){
            return false;
        }
    };

    async sendCanvas(){
        const response = await post('http://localhost:8000/start', this.props.nodes)
        console.log(response.data)
    }

    render() {
        return (
            <div className="Navbar">   
                <button className="ShowLogsButton" onClick={this.props.showLogs}><TerminalIcon /> Show Logs</button>
                <button className="JSONEntryButton" onClick={this.props.showJSONEntry}> <JSONIcon/> JSON Entry </button>  
                <button className="RunButton" onClick={this.sendCanvas}><PlayIcon /> Run</button>          
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