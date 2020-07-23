import React, {Component} from 'react';
import './styles_control.css'
import treeImage from './Assets/tree.png'
import Cookies from 'js-cookie'
import Switch from "react-switch"
import { AreaConsumer } from '../context/AreaContext';


const formValid = formErrors => {

    let valid = true

    Object.values(formErrors).forEach( val => {
        val.lenght > 0 && (valid = false) 
    });

    return valid
}

class ControlMonitor extends Component {

    getValue(detailArea){
        if(detailArea){
            Cookies.set('areaID', detailArea.areaID)
            Cookies.set('device', detailArea.device)
            Cookies.set('sensor', detailArea.sensor)
            return {_areaID: detailArea.areaID,
                    _device: detailArea.device,  
                    _sensor: detailArea.sensor,
                    _statusMonitor: detailArea.device.status,
                    _powerMonitor: detailArea.device.power}
        }
        else{
            return {sensorID: Cookies.get('areaID'), springThreshold: Cookies.get('threshold')}
        }
    }

    constructor(props){
        super(props);
        this.state = {
            areaID: '',
            device: {},
            sensor:{},
            monitorId :'',
            statusMonitor: true,
            magnitudeMonitor : '',
            // status: false,
            // power: 0,
            formErrors:{
                monitorId :'',
                magnitudeMonitor : '',
            },
        }
        // this.state = { checked: false };
        this.handleChangeSwitch = this.handleChangeSwitch.bind(this);
    }

    async componentDidMount(){
        this.setState({areaID: Cookies.get("areaID")})
        await fetch('/getmotor', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({areaID: Cookies.get('areaID')})
          }).then(value => {
            value.json().then(db =>{
                // console.log(db)
              this.setState({status: db[0]["device"]["status"], power: db[0]["device"]["power"]})
            //   console.log(this.state.motorlist)
            })
        })
    }

    handleSubmit = e =>{
        // console.log(this.state)
        e.preventDefault();
        fetch('/updatePower', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({areaID: this.state.areaID, status: this.state.status, power: this.state.power})
          }).then(() =>
            alert("Update Successfull!")          
          )
    }

    handleChangeSwitch(checked) {
        // console.log(checked)
        this.setState({status: checked})
    }

    handleChange = e => {
        e.preventDefault()

        const {name, value} = e.target;
        let formErrors = this.state.formErrors;
        this.setState({power: e.target.value})

        switch(name)
        {
            case 'magnitudeMonitor':
                formErrors.magnitudeMonitor =
                (value < 1 || value > 3) && value != '' 
                ? "Out of range"
                : ""
                break;
            default:
                break;
        }
        this.setState({formErrors, [name]: value});

    }

    render(){

        const formErrors = this.state.formErrors; 

        
        return (
            <AreaConsumer>
                {value => {
                    
                    // const {_areaID, _device, _sensor, _statusMonitor, _powerMonitor }=this.getValue(value.detailArea);
                    const {_statusMonitor, _powerMonitor} = {_statusMonitor: this.state.status,_powerMonitor: this.state.power}

                    return (
            <div className='wrapper_control'>
                <div className='form-wrapper'>
                    <h1 style={{marginBottom:'10px'}}>Control Motor</h1>

                    <div className='flex-main'>

                        <form onSubmit={this.handleSubmit}  noValidate>
                        <div className='sensorId_plantType'>
                            <div className=''>
                                <label htmlFor='statusMonitor'>Motor Status: </label>
                                <Switch onChange={this.handleChangeSwitch} checked={_statusMonitor}/>
                            </div>
                            <div className=''>
                                <label htmlFor='magnitudeMonitor'>Magnitude: </label>
                                <input 
                                    type = 'number'
                                    min = '1'
                                    max = '3'
                                    className = ''
                                    placeholder = 'Magnitude'
                                    name = 'magnitudeMonitor'
                                    defaultValue={_powerMonitor}
                                    onChange={this.handleChange}
                                />
                                <br></br>
                                {formErrors.magnitudeMonitor !== null && 
                                    (<span className="errorMessage">{formErrors.magnitudeMonitor}</span>)}
                            </div>
                            
                        </div>

                        <div className='submitApply'>
                            <button type='submit'>Apply</button>
                        </div>

                        </form>

                        <div className='imagePlant'>
                            <img src={treeImage} alt="Plant"/>

                        </div>
                    
                    </div>




                </div>

            </div>
                    )
                }}
            </AreaConsumer>
        )

    }
} 

export default ControlMonitor;