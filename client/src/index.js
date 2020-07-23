import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";
import registerServiceWorker from "./registerServiceWorker";
import "./style/global";
import "./index.css"
import {BrowserRouter as Router} from 'react-router-dom';
import {SensorProvider} from './components/context'
import {AreaProvider} from './components/context/AreaContext'

ReactDOM.render(
  <SensorProvider>
    <AreaProvider>
    <Router>
    <App />
  </Router>
  </AreaProvider>
  </SensorProvider>, 
    document.getElementById("root"));
registerServiceWorker();
