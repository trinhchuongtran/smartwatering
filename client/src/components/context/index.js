import React,{ Component} from 'react';
import storeSensors from '../mongo'
import openSocket from 'socket.io-client';


const SensorContext = React.createContext();

//Provider
//Consumer

class SensorProvider extends Component{
    
    state={
        sensors: storeSensors,
        areaID: ''
    };
    
    componentWillMount(){
      this.getData()
    }

    getData = () => {
        fetch('/api/sensor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(value => {
          value.json().then(db =>{
            // console.log("listsensor: ", db)
            this.setState({sensors: db})
          })
        })
      };

    setSensors = ()=>{
        let tempSensors =[];
        storeSensors.forEach(item=>{
            const singleItem ={...item};
            tempSensors =[...tempSensors, singleItem];
        });
        this.setState(()=>{
            return { sensors: tempSensors};
        });
    };
    handleDetail =(id)=>{
        const sensor = this.getItem(id);
        // console.log(sensor)
        this.setState( ()=>{
            return {detailSensor:sensor}
        })
    };
    getItem = (id) => {
        const sensor = this.state.sensors.find(item => item.sensorID === id);
        return sensor;
    }
    render(){
        
    const socket = openSocket('http://localhost:4000/');
    socket.on('chat', (datatest)=>{
        // this.handleDetail(datatest[0].device_id)
        fetch('/api/updatesensor', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datatest)
          }).then(data=>{
            data.json().then(db =>{
              this.setState({sensors: db}) 
            })
          })
      })
        return (
           
            <SensorContext.Provider value={{
                ...this.state,
                handleDetail:this.handleDetail,
                
            }}>
                {this.props.children}
            </SensorContext.Provider>
        );
    }
}
const SensorConsumer = SensorContext.Consumer;

export {SensorProvider, SensorConsumer};
