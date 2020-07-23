//@flow

import React, {Component, useState} from "react";
import {SensorConsumer} from '../../components/context';
import CreateChart from '../../components/Chart';
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import Moment from 'moment';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import html2canvas from "html2canvas";
import DatePicker from 'react-datepicker';
import Header from "../Header";
require('react-datepicker/dist/react-datepicker.css')
const pdfConverter = require("jspdf");
const Mode = ({mode, onClick1, onClick2, onClick3}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  return(
       <Dropdown direction= "right" isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret>
        {mode}
        </DropdownToggle>

        <DropdownMenu>
            <DropdownItem onClick = {onClick1}>Today</DropdownItem>
            <DropdownItem onClick = {onClick2}>This week</DropdownItem>
            <DropdownItem onClick = {onClick3}>This month</DropdownItem>
        </DropdownMenu>
  </Dropdown>
  )
}


class Analytic extends Component{
  state = {
    sensorID: '',
    moisture: []
  }

  async componentWillMount(){
    await fetch('/getmoisture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({sensorID: Cookies.get('sensorID')})
    }).then(async (value) => {
      await value.json().then(async (db) =>{
        await this.setState({sensorID: db[0]['sensorID'], moisture: db[0]['moisture']})
      })
    })
  }

  constructor(props) {
            super(props)
            this.state = {
            mode: "Today",
            time: new Date(),
            type: true,
            monthYear: null
            }
  }

  componentDidMount() {
    this.setState( {mode: "None", type: true} )
  }

  onClickMode1 = () =>{
    this.setState(state => ({ mode: "Today", type: true}))
  }
  onClickMode2 = () =>{
      this.setState(state => ({ mode: "This week", type: true }) )
  }
  onClickMode3 = () =>{
      this.setState(state => ({ mode: "This month", type: true }) )
  }

  setTime = (date, monthYear) => {
       this.setState(state => ({ time: date, type: false, monthYear: monthYear}))
  }

  div2PDF = e => {
        //  const but = e.target;
         let input = window.document.getElementsByClassName("chart2pdf")[0];

         html2canvas(input, {scrollY: -window.scrollY}).then(canvas => {
           const img = canvas.toDataURL("image/png");
           const pdf = new pdfConverter("l", "mm", "a4");
           var width = pdf.internal.pageSize.getWidth();
           var height = pdf.internal.pageSize.getHeight();
           pdf.addImage(img,"png",0,0,width,height);
           var str1 = "chart_export_";
           var str2 = Date(Moment().format("dd-MM-YYYY")).toString();
           var str3 = ".pdf";
           pdf.save(str1.concat(str2).concat(str3));
         });
  };

  render(){
      return (
          <div>
          <Header/>
          <DatePicker
            selected={this.state.time}
            onChange={date => this.setTime(date, "Month")}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />

          <DatePicker
            selected={this.state.time}
            onChange={date => this.setTime(date, "Year")}
            showYearPicker
            dateFormat="yyyy"
          />

          <Mode mode = {this.state.mode} onClick1 = {this.onClickMode1} onClick2 = {this.onClickMode2} onClick3 = {this.onClickMode3}/>
          <SensorConsumer>
              {value=>{
                const sensorID= this.state.sensorID;
              return (
                 <main>
                 <Link to='/viewLog'>
                    <button id="backButton">Back to view log</button>
                 </Link>
                 <div className = "chart2pdf">
                 <h1 style={{textAlign: "center", fontSize: "2em"}}>Moisture Analytic of Sensor {sensorID}</h1>
                 {
                 <CreateChart mode = {this.state.mode} time = {this.state.time} type = {this.state.type} monthYear = {this.state.monthYear}/>
                 }

                 </div>
                  <div>
                    <button onClick={(e) => this.div2PDF(e)}>Export to PDF</button>
                  </div>
                 </main>

              )           
              }}
          </SensorConsumer>
          </div>
      );
  }
}

export default Analytic;
