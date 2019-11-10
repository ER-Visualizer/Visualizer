import React from 'react';
import "./Navbar.css";
import { connect } from 'react-redux';
import  {showLogs, showNodeConfig } from '../redux/actions'
import {ReactComponent as PlayIcon} from '../play.svg';
import {ReactComponent as TerminalIcon} from '../terminal.svg';

class Navbar extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="Navbar">   
                <button className="ShowLogsButton" onClick={this.props.showLogs}><TerminalIcon /> Show Logs</button>
                <button className="RunButton"><PlayIcon /> Run</button>           
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {}
  }
  
const mapDispatchToProps = dispatch => {
    return {
        showLogs: () => {
            dispatch(showLogs())
        },
        showNodeConfig: () => {
            dispatch(showNodeConfig())
        },
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navbar)