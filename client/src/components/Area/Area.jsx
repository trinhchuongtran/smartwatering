import React,{ Component} from 'react';
import {Link} from 'react-router-dom';
import {AreaConsumer} from '../context/AreaContext';
import Cookies from 'js-cookie';
import { Button } from 'reactstrap';


class Area extends Component{
    setCookies(areaID){
        Cookies.set('areaID', areaID)
    }

    render(){
        const {areaID, device, moisture}=this.props.area;

        return (
            
            <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                <a href="#" className="thumbnail">
                <AreaConsumer>
                {value =>{
                    return (
                        <div className="img-container p-5 areaDetail"
                        onClick={()=>value.handleDetail(areaID) }>
                            
                            <div className='inforAreaDetail'>
                                <div className='inforAreaID'>
                                    <p className='inforAreaStatusOnOff'>Area: {areaID}</p>
                                    <p className='inforAreaStatusPower'>Moisture: {moisture}</p>
                                </div>
                                <div className='inforAreaStatus'>
                                    <div className='inforAreaStatusOnOff'>
                                        <p>
                                            Monitor Status: {device.status == true ? "ON": "OFF"}                                             
                                        </p>
                                    </div>
                                    <div className='inforAreaStatusPower'>
                                    {device.status == true && 
                                            (<span className="statusMonitor">Power: {device.power}</span>)}
                                    </div>  
                                    
                                </div>
                            </div>

                            <div className='buttonArea'>
                                <Link to="/Config" onClick = {() => this.setCookies(areaID)}>
                                    <Button color='primary' className="detail-btn" >
                                    Config Sensor
                                    </Button>   
                                </Link>
                                <Link to="/ControlMotor" onClick = {() => this.setCookies(areaID)}>
                                    <Button color='primary' className="detail-btn" >
                                    Control Motor
                                    </Button>   
                                </Link>
                                <Link to="/viewLog" onClick = {() => this.setCookies(areaID)}>
                                    <Button color='primary' className="detail-btn" >
                                    List Sensor  
                                    </Button>   
                                </Link>
                            </div>


                        
                      
                        </div>)
                }}  
                </AreaConsumer>
                </a>
            </div>
        );
    }
}

export default Area;
