import React,{ Component} from 'react';
import openSocket from 'socket.io-client';
import Cookies from 'js-cookie';


const AreaContext = React.createContext();

//Provider
//Consumer

class AreaProvider extends Component{
    
    state={
        areas: [],
    };

    componentWillMount(){
        this.getData()
    }
    

    getData = () => {
        fetch('/api/area', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(value => {
          value.json().then(db =>{
            this.setState({areas: db})
          })
        })
      };

    handleDetail = (id) =>{
        const area = this.getItem(id);
        this.setState(() =>{
            return {detailArea: area}
        })
    };
    getItem = (id) => {
        const area = this.state.areas.find(item => item.areaID === id);
        //console.log('aaa = ', area.sensor.sensorIDs)
        return area;
    }
    render(){
            
        return (
            <AreaContext.Provider value={{
                ...this.state,
                handleDetail:this.handleDetail

            }}>
                {this.props.children}
            </AreaContext.Provider>
        );
    }
}
const AreaConsumer = AreaContext.Consumer;

export {AreaProvider, AreaConsumer};
