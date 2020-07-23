import React, {Component} from 'react';
import './styles.css'
import treeImage from './assets/tree.png'
import data from './assets/data.json'
import Cookies from 'js-cookie'
import { SensorConsumer } from '../context';
import {AreaConsumer} from '../context/AreaContext'


const formValid = formErrors => {

    let valid = true

    Object.values(formErrors).forEach( val => {
        val.lenght > 0 && (valid = false) 
    });

    return valid
}

class ConfigPage extends Component {

    state={
        areaID: '',
        sensor: [],
    }

    async componentWillMount(){
        await fetch('/gettheshold', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({areaID: Cookies.get('areaID')})
        }).then(data=>{
          data.json().then(db =>{
            this.setState({areaID: db[0]['areaID'], threshold: db[0]['sensor']['threshold']})
          })
        })
      }

    getValue(detailArea){
        if(detailArea){
            Cookies.set('areaID', detailArea.areaID)
            Cookies.set('device', detailArea.device)
            Cookies.set('sensor', detailArea.sensor)
            console.log('vao duoc')
            return {_areaID: detailArea.areaID, _device: detailArea.device,  _sensor: detailArea.sensor}
        }
        else{
            console.log('khong vao duoc')
            return {sensorID: Cookies.get('areaID'), springThreshold: Cookies.get('threshold')}
        }
    }

    constructor(props){
        super(props);
        this.state = {
            areaID: '',
            device: {},
            sensor:{},
            
             
            springThreshold : null,
            formErrors:{
                sensorId :'',
                plantType : '',
                
                springThreshold : '',
            }
        }
    }

    handleSubmit = e =>{
        e.preventDefault();

        if(formValid(this.state.formErrors)){
            console.log(`
                -- SUBMITTING --
                Sensor ID: ${this.state.sensorId}
                Plant Type: ${this.state.plantType}
                Spring Threshold: ${this.state.springThreshold}
            `)
        }
        else{
            console.error('Form invalid - display message error');
        }

    }

    submitData= e => {
        e.preventDefault();
        fetch('/updateTheshold', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({areaID: this.state.areaID, threshold: this.state.threshold})
          }).then(() =>
            alert("Update Successfull!")          
          )
    }

    handleChange = e => {
        e.preventDefault();
        const {name, value} = e.target;
        let formErrors = this.state.formErrors;
        // console.log(e.target.name)
        if(e.target.name == "areaID"){
            this.setState({areaID: e.target.value})
        }
        else{
            this.setState({threshold: e.target.value})
        }
        switch(name)
        {
            case 'springThreshold':
                formErrors.springThreshold =
                (value < 1 || value >1024 ) && value != ''
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
                    const {_areaID, _threshold } ={_areaID: this.state.areaID, _threshold: this.state.threshold };

                    return (
                        <div className='wrapper_config'>
                            <div className='form-wrapper'>
                                <h1 style={{marginBottom:'10px'}}>Config Area</h1>
            
                                <div className='flex-main'>
            
                                    <form onSubmit={this.handleSubmit}  noValidate>
                                    <div className='sensorId_plantType'>
                                            <label htmlFor='areaID'>Area ID: </label>
                                            <input 
                                                type = 'text'
                                                className = 'areaID'
                                                placeholder = 'Area ID'
                                                name = 'areaID'
                                                value= {_areaID}
                                                noValidate
                                                onChange={this.handleChange}
                                            />
                                    </div>
            
            
                                    <div className='threshold_amount_water'>
                                            <div className='_titleThresholdAmount'>Threshold</div>
                                            <div className='_inputThresholdAmount'>
                                                <input 
                                                    type = 'number'
                                                    min = '0'
                                                    max = '1023'
                                                    className = 'input_config'
                                                    placeholder = 'Threshold'
                                                    name = 'threshold'
                                                    defaultValue= {_threshold}
                                                    onChange={this.handleChange}
                                                />
                                                {formErrors.springThreshold !== null && 
                                                (<span className="errorMessage">{formErrors.springThreshold}</span>)}
                                        </div>
            
            
            
            
            
                                        
                                    </div>
            
                                    <div className='submitApply'>
                                        <button type='submit' onClick={(e)=> {this.submitData(e)}}>Apply</button>
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

export default ConfigPage;