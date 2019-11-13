import React from 'react';
import './LogsSidebarContent.css';

class LogsSidebarContent extends React.Component {
    constructor(props) {
        super(props)
    }

    renderLogLine(key, message) {
        return <div key={key} className="LogLine">{message}</div>
    }

    renderLogLines() {
        let logLines = []
        for (var i = 0; i < this.props.logs.length; i++) {
            logLines.push(this.renderLogLine("log_" + i.toString(), this.props.logs[i]['message']))
        }
        return logLines
    }

    render() {
        return (
            <div className="LogsSidebarContent">                
                {this.renderLogLines()}
            </div>
        )
    }
}

export default LogsSidebarContent