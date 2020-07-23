//@flow

import React, {Component} from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Users from "../LogDetail";
import Header from "../../components/Header";
import './App.css'
import ConfigPage from "../../components/Config/ConfigPage"
import SensorList from "../../components/SensorList"
import LogDetail from "../LogDetail";
import Login from "../../components/Login";
import PrivateLogin from "../../Route/PrivateRoute";
import GotoLogin from "../../Route/GotoLogin"
import Cookies from 'js-cookie'
import Analytic from "../../components/Analytic";
import CreateChart from "../../components/Chart";
import AreaList from "../../components/AreaList/AreaList";
import ListSensor from "../../components/ListSensor/ListSensor";
import ControlMonitor from "../../components/ControlMonitor/ControlMonitor";


class App extends Component{
  render(){
      console.log("username: ", Cookies.get('username'))
      return(
        <BrowserRouter>
        <div>
          <Switch>
            <Route path="/login" component={Login}/>
            {/* <GotoLogin path="/" /> */}
            <Route path="/listArea" component={AreaList}/>
            <Route  path="/viewLog" component={SensorList} />
            <Route  path="/config" component={ConfigPage} />
            <Route  path="/logDetail" component={LogDetail} />
            <Route  path="/analytic" component={Analytic}/>
            <Route  path="/chart" component={CreateChart}/>
            <Route  path="/ListSensor" component={ListSensor}/>
            <Route  path="/controlmotor" component={ControlMonitor}/>
          </Switch>
        </div>
        </BrowserRouter>
      )
    // }
  }
}

export default App;
