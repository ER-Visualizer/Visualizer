import React from 'react';
import Main from "./components/Main";
import './App.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Router, Route } from "react-router-dom";
function App() {

  return (
    <Provider store={store}>
      <div className="App">
          <Main/>  
      </div>
    </Provider>
  );
}

export default App;
