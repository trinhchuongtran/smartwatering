import React,{ Component} from 'react';
import {Link} from 'react-router-dom';
import {SensorConsumer} from "../context";
import {Button} from 'reactstrap';
import './styles.css'
import Cookies from 'js-cookie';

class Sensor extends Component{
    setCookie(sensorID){
        Cookies.set('sensorID', sensorID)
    }

    render(){
        const{sensorID,current}=this.props.sensor;
        // console.log(this.props.sensor)
        return (
            
            <div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                
                <a href="#" class="thumbnail">
                <SensorConsumer>
                {value =>{
                    return (
                        
                        <div className="img-container p-5 sensorDetail"
                        onClick={()=>value.handleDetail(sensorID) }>
                        
                        <div className='inforSensor'>
                            <p>Name: Sensor {sensorID}</p>
                            <p>Moisture: {current}</p>
                        </div>
                        
                        <div className='buttonSensor'>
                            <Link to="/logDetail" onClick={()=> this.setCookie(sensorID)}>
                                <Button color='primary' className="detail-btn" >
                                Log Detail  
                                </Button>   
                            </Link>
                            <Link to="/analytic" onClick={()=> this.setCookie(sensorID)}>
                                <Button color='primary' className="detail-btn" >
                                View Chart
                                </Button>   
                            </Link>
                        </div>
                     


                        </div>)
                }}  
                </SensorConsumer>
                </a>
            </div>
        );
    }
}

export default Sensor;
