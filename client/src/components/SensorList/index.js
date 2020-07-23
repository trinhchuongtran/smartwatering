import React, {Component} from 'react';
import Sensor from '../Sensor';
import storeSensors from '../mongo';
import {SensorConsumer} from '../context';
import openSocket from 'socket.io-client';
import Cookies from 'js-cookie';
import Header from '../Header';


class SensorList extends Component {
  state={
    sensorlist: []
  };

  async componentWillMount(){
    await fetch('/getsensor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({areaID: Cookies.get('areaID')})
    }).then(value => {
      value.json().then(db =>{
        this.setState({sensorlist: db})
      })
    })
  }

  render (){
    return(
      <div>
      <Header/>
      <div class='container'>
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <h1 style={{textAlign: "center", fontSize: "3em"}}>List sensors of {Cookies.get('areaID')} </h1>
          <div>
          <SensorConsumer>
            { value => { 
              return this.state.sensorlist.map(sensor =>{
                return <Sensor key={sensor.id} sensor={sensor}/>
              });
            }}
            
            </SensorConsumer>
          </div>
      </div>

      </div>     
      </div>
    )
  }
      

}

export default SensorList;
