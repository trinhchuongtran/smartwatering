import React, {Component} from 'react';
import Area from '../Area/Area';
//import storeSensors from '../mongo';
//import {SensorConsumer} from '../context';
import './styles.css'
import {AreaConsumer} from '../context/AreaContext'
// import {SensorConsumer} from '../context'
import Cookies from 'js-cookie'
// import ListSensor from '../ListSensor/ListSensor';
import Header from '../Header';


class AreaList extends Component {
  state={
    arealist: [],
  };

  async componentWillMount(){
    await fetch('/getarea', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username: Cookies.get('username')})
    }).then(value => {
      value.json().then(db =>{
        this.setState({arealist: db})
      })
    })
  }

  render (){
    return(
      <div>
        <Header/>
      <div className='container'>
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <h1 style={{textAlign: "center", fontSize: "3em"}}>List Area of {Cookies.get('username')} </h1>
          <div style={{margin: 'auto'}}>
          <AreaConsumer>
            { value => { 
              // console.log('value_area_list = ', value)
              return this.state.arealist.map(area =>{
                return <Area key={area.id} area={area}/>
              });
            }}
            </AreaConsumer>
          </div>
      </div>

      </div>
      </div>     
    )
  }
      

}

export default AreaList;
