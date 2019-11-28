import React from 'react';
import './LinkSidebarContent.css';

class LinkSidebarContent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="LinkSidebarContent">      
                <div className="input-container">
                    <label>Is a prediction edge?</label><br/>
                    <select>
                        <option value="acuity">Acuity</option>
                        <option value="arrival time">Arrival Time</option>
                    </select>
                </div>         
            </div>
        )
    }
}

export default LinkSidebarContent;