//@flow

import React, {Component, useState} from "react";
import styled from "styled-components";
import {SensorConsumer} from '../context';
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import Chart from 'chart.js';
import {Line} from 'react-chartjs-2';
import Moment from 'moment'


const LineGraph = (props) => {
    const time = props.chartLabel
    const value = props.chartData
    const data ={
                        labels: time,
                        datasets: [{
                            label: 'Moisture',
                            data: value,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)'
                            ],
                            borderWidth: 1
                        }]
   };
    return (
        <Line
            data = {data}
            height={null}
            width={null}

            options = {{
                aspectRatio: 0.7,
                responsive: true,
                maintainAspectRatio:false,
                legend: {
                                display: false
                            },
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        fontSize: 12,
                                        display: true
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        fontSize: 12,
                                        beginAtZero: true
                                    }
                                }]
                            }

            }

            }
        />
    )
  }




class CreateChart extends Component{
state={
    moisture:null
}
  getValue = async () => {
      await fetch('/getmoisture', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({sensorID: Cookies.get('sensorID')})
              }).then(value => {
                value.json().then(db =>{
                    // console.log("chart: ", db)
                  this.setState({moisture: db[0]['moisture']})
                })
              })
  }

  constructor(props) {
          super(props)
          this.state = {
          labels: [],
          data:[]
          }
  }


   componentDidMount() {
        //TODO: filter today value and map to 24hrs
        this.getValue()
        const {sensorID,moisture} = {sensorID: Cookies.get('sensorID'), moisture: this.state.moisture}
   }

   async componentWillUpdate(nextProps, nextState){

        if (nextProps.mode == "Today" && this.props.mode != "Today") {
            this.getValue()
            const {sensorID,moisture} = {sensorID: Cookies.get('sensorID'), moisture: this.state.moisture}
            var hours = Array.apply(null, {length: 24}).map(Number.call, Number)
            var month = Moment()
            var temp = Array.from(Array(24), () => new Array(2).fill(0))
            moisture.forEach(
                m => {
                    var d = new Date(m.time)
                    var p = new Date(month)
                    if (d.getMonth() == p.getMonth() && d.getFullYear() == p.getFullYear() && d.getDate() == p.getDate()){
                        var index = d.getHours()

                        temp[index][0] += m.value
                        temp[index][1] += 1
                    }
                }
            )
            var data = new Array(24).fill(0)
            for (var i = 0; i < temp.length; i++) {
                if(temp[i][1] != 0) data[i] = (temp[i][0]/temp[i][1]).toFixed(3);
            }
            this.setState( {labels: hours, data: data} )
        }
        if (nextProps.mode == "This week" && this.props.mode != "This week") {
            this.getValue()
            const {sensorID,moisture} = {sensorID: Cookies.get('sensorID'), moisture: this.state.moisture}
            var week = Moment()
            var startOfWeek = week.startOf('isoweek').toDate();
            var endOfWeek = week.endOf('isoweek').toDate();
            var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
            var temp = Array.from(Array(7), () => new Array(2).fill(0))
            moisture.forEach(
                m => {
                    var d = new Date(m.time)
                    var p = new Date(week)
                    if (startOfWeek.getTime() <= d.getTime() && endOfWeek.getTime() >= d.getTime()){
                        var index = d.getDay()
                        temp[index][0] += m.value
                        temp[index][1] += 1
                    }
                }
            )
            var data = new Array(7).fill(0)
            for (var i = 0; i < temp.length; i++) {
                if(temp[i][1] != 0) data[i] = (temp[i][0]/temp[i][1]).toFixed(3);
            }
            this.setState( {labels: days, data: data} )
        }
        if (nextProps.mode == "This month" && this.props.mode != "This month") {
            this.getValue()
            const {sensorID,moisture} = {sensorID: Cookies.get('sensorID'), moisture: this.state.moisture}
           var month = Moment().format("YYYY-MM")
           const daysNum = Moment(month,"YYYY-MM").daysInMonth();
           var days = Array.from(Array(daysNum), (_, i) => i+1)
           var temp = Array.from(Array(daysNum), () => new Array(2).fill(0))
           moisture.forEach(
                m => {
                    var d = new Date(m.time)
                    var p = new Date(month)
                    if (d.getMonth() == p.getMonth() && d.getFullYear() == p.getFullYear()){
                        var index = d.getDate() - 1
                        temp[index][0] += m.value
                        temp[index][1] += 1
                     }
                }
           )
           var data = new Array(daysNum).fill(0)
           for (var i = 0; i < temp.length; i++) {
                if(temp[i][1] != 0) data[i] = (temp[i][0]/temp[i][1]).toFixed(3);
           }
           this.setState( {labels: days, data: data} )
        }
        if (nextProps.monthYear == "Month" && this.props.time != nextProps.time){
            this.getValue().catch()
            const {sensorID,moisture} = {sensorID: Cookies.get('sensorID'), moisture: this.state.moisture}
            const daysNum = Moment(nextProps.time,"YYYY-MM").daysInMonth();
            var days = Array.from(Array(daysNum), (_, i) => i+1)
            var temp = Array.from(Array(daysNum), () => new Array(2).fill(0))
            moisture.forEach(
                m => {
                    var d = new Date(m.time)
                    var p = new Date(nextProps.time)
                    if (d.getMonth() == p.getMonth() && d.getFullYear() == p.getFullYear()){
                        var index = d.getDate() - 1
                        temp[index][0] += m.value
                        temp[index][1] += 1
                    }
                }
            )
            var data = new Array(daysNum).fill(0)
            for (var i = 0; i < temp.length; i++) {
              if(temp[i][1] != 0) data[i] = (temp[i][0]/temp[i][1]).toFixed(3);
              else data[i] = 0;
            }
            this.setState( {labels: days, data: data} )

        }
        if (nextProps.monthYear == "Year" && this.props.time != nextProps.time){
            this.getValue()
            const {sensorID,moisture} = {sensorID: Cookies.get('sensorID'), moisture: this.state.moisture}
            var month = Array.from(Array(12), (_, i) => i+1)
            var temp = Array.from(Array(12), () => new Array(2).fill(0))
            moisture.forEach(
                m => {
                    var d = new Date(m.time)
                    var p = new Date(nextProps.time)
                    if (d.getFullYear() == p.getFullYear()){
                        var index = d.getMonth()
                        temp[index][0] += m.value
                        temp[index][1] += 1
                    }
                }
            )
            var data = new Array(12).fill(0)
            for (var i = 0; i < temp.length; i++) {
            if(temp[i][1] != 0) data[i] = (temp[i][0]/temp[i][1]).toFixed(3);
            }
            this.setState( {labels: month, data: data} )
        }
   }
  render(){
      const {labels,data} = this.state
      return (
            <div className = "chart">
            <h1 style={{textAlign: "center", fontSize: "1em"}}>
            {this.props.type?
                this.props.mode:
                (this.props.monthYear == "Month"?
                    Moment(this.props.time).format("MM/yyyy"):
                    Moment(this.props.time).format("yyyy")
                )
                }
            </h1>
            <LineGraph chartData={data} chartLabel = {labels}/>
            </div>
      );
  }
}

export default CreateChart;
