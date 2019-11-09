import React from 'react';
import "./Navbar.css";
import { connect } from 'react-redux';
import  {showLogs, showNodeConfig } from '../redux/actions'

class Navbar extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="Navbar">                
                <button onClick={this.props.showLogs}> Show Logs</button>
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