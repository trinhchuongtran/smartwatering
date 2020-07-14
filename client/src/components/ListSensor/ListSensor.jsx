import React, {Component} from 'react';
import Sensor from '../Sensor';
import {SensorConsumer} from '../context';
import {AreaConsumer} from '../context/AreaContext'
import Cookies from 'js-cookie'

class ListSensor extends Component {
  render (){
    const listSensor = this.props.listSensor;
    console.log('listSensor ', listSensor)
    return(
      <div class='container'>
      
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <a href="#" className="thumbnail">
          <div>
            <Sensor listSensor={listSensor}/>
          </div>
        </a>
      </div>
      </div>     
    )
  }
}

export default ListSensor;
