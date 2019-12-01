import React from 'react';
import './LogsSidebarContent.css';
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
class LogsSidebarContent extends React.Component {
    constructor(props) {
        super(props)
    }

    renderLogLine(key, message) {
        return <div key={key} className="LogLine">{message}</div>
    }


    render() {
        const Row = ({ index, style }) => (
          <div style={style}>
            {this.renderLogLine("log_" + index.toString(), this.props.logs[index]['message'])}
          </div>
        );
        return (
            <div className="LogsSidebarContent">                
                <AutoSizer>
                {({ height, width}) =>(
                    <List
                    className="List"
                    height={height}
                    itemCount={this.props.logs.length}
                    itemSize={35}
                    width={width}
                    >
                    {Row}
                    </List>

                    )}
                </AutoSizer>
            </div>
        )
    }
}

export default LogsSidebarContent