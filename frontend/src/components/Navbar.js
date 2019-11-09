import React from 'react';
import "./Navbar.css";

class Navbar extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="Navbar">                
                <button> Show Logs</button>
            </div>
        )
    }
}

export default Navbar