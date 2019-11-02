import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as d3 from 'd3';
import { Graph } from "react-d3-graph";

function App() {
  let graphical_data = { // graphical representation
    nodes: [{ id: "Reception0" }, { id: "Triage0" }, { id: "PD0" }],
    links: [{ source: "Reception0", target: "Triage0" }, { source: "Triage0", target: "PD0" }],
  };

  let module_data = {

  }

  const myConfig = {
    nodeHighlightBehavior: true,
    width: window.innerWidth,
    height: window.innerHeight,
    node: {
        color: "lightgreen",
        size: 1000,
        highlightStrokeColor: "blue",
    },
    link: {
        highlightColor: "lightblue",
    },
  };

  const onClickNode = function(nodeId){
    alert(nodeId);
  }
  return (
    <div className="App">
      {/* <input type="button"/> */}
      <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        data={graphical_data}
        
        config={myConfig}
        onClickNode={onClickNode}
        directed={true}
        
        />
        
    </div>
  );
}

// {
//   data.nodes.push({id: "newnode"})
//   }
//   {
//     data.links.push({source: "newnode", target:"Sally"})
//   }

export default App;
