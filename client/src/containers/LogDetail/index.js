//@flow

import React, {Component, useState} from "react";
import styled from "styled-components";
import {SensorConsumer} from '../../components/context';
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';

//add
import {Button} from 'reactstrap';
// import { DateRange } from 'react-date-range';
import openSocket from 'socket.io-client';

import Moment from 'react-moment';
import Pagination from "react-js-pagination";
import "./index.css";
import search from './search.png';
import ReactToExcel from 'react-html-table-to-excel'
import Header from "../../components/Header";

 

const Main = styled.div`
  padding: 10px 20px 0px 20px;
`;








class LogDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      startDate : new Date(),
      endDate : new Date(),
      activePage:1,
      sensorID: '',
      moisture: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.searchName = this.searchName.bind(this);
    // this.handleLoginKeyUp = this.keyUpHandler.bind(this, 'LoginInput');
    // this.handlePwdKeyUp = this.keyUpHandler.bind(this, 'PwdInput');  
  }

  async componentWillMount(){
    await fetch('/getmoisture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({sensorID: Cookies.get('sensorID')})
    }).then(data=>{
      data.json().then(db =>{
        this.setState({sensorID: db[0]['sensorID'], moisture: db[0]['moisture']})
      })
    })
  }
  

  handleInputChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event){
    var listDates=document.getElementsByClassName("datesensor");
    var d = new Date(listDates[1].textContent);
    var startDate = new Date(this.state.startDate);
    var endDate = new Date(this.state.endDate);
    var count = 0;
    for (var i = 0; i < listDates.length; i++){
      listDates[i].parentElement.parentElement.style.display = "";
    }
    for (var i = 0; i < listDates.length; i++){
      var day = new Date(listDates[i].textContent);
      if (startDate.getTime() > day.getTime() || endDate.getTime() < day.getTime()){
        listDates[i].parentElement.parentElement.style.display = "none";
      }
    }
    // alert(count);
    event.preventDefault();
  }

  state ={
    sensorID: '',
    moisture: [],
    test: ''
  }
  handlePageChange(pageNumber) {
    console.log({pageNumber});
    this.setState({activePage: pageNumber});
    var tr = document.getElementsByClassName("rowsensor");
    for (var i = 0; i < tr.length; i++) {
            tr[i].style.display="";
    }
    for (var i = 0; i < tr.length; i++) {
      if(i<(pageNumber-1)*5 || i>=pageNumber*5){
        tr[i].style.display="none";
      }
}

  }    // When the user clicks on the button, scroll to the top of the document
    topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
  searchName() {
    var input, filter, table, tr, td, j, i, tbody, txtValue;
    input = document.getElementById("nameSearch");
    filter = input.value.toUpperCase();
    tr = document.getElementsByClassName("rowsensor");
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        for (j = 0; j < tr[i].getElementsByTagName("td").length; j++){      
            td = tr[i].getElementsByTagName("td")[j];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

  }


  
  renderTableData(moisture) {
    return moisture.map((item)=>{
      return  (
        <tr className="rowsensor">
                        <td><Moment className="datesensor" format="YYYY/MM/DD" aria-hidden={true}>{item.time}</Moment></td>
                        <td><Moment className="hoursensor" format="HH:MM:SS" aria-hidden={true}>{item.time}</Moment></td>
                        <td>{item.value}</td>
                        <td>{item.status=="1"?"ON":"OFF"}</td>
                      </tr>
      )
    })
   
}

  render(){
      return (
        <SensorConsumer>
            {value=>{             
                const{sensorID,moisture}={sensorID: this.state.sensorID, moisture: this.state.moisture};


                return (


                  <main>
        <Header/>
                  <Link to='/viewLog'>
                     <Button id="backButton" className="btn btn-primary">Back</Button>
                  </Link>
                  <Button id="topButton" onClick={this.topFunction} className="btn top btn-secondary"></Button>
                   
                  <h1 style={{textAlign: "center", fontSize: "3em"}}>Detail log of {sensorID}</h1>
                  
                 {
 
                   <form onSubmit={this.handleSubmit} style={{display:"inline-block",width:'70%'}}>
                     <label style={{fontSize:'1.5rem',padding:'1rem'}}>Start date:
                   
                       <input 
                         
                         name="startDate"
                         type="date"
                         value={this.state.startDate}
                         onChange={this.handleInputChange}
                         style={{fontSize:'1.5rem',marginLeft:'1rem', height:'100%'}}        
                       />
                     </label>
                     <label style={{fontSize:'1.5rem',padding:'1rem'}}>End date:
                       <input 
                         name="endDate"
                         type="date"
                         value={this.state.endDate}
                         onChange={this.handleInputChange}
                         style={{fontSize:'1.5rem',marginLeft:'1rem', height:'100%'}}       
                       />
                     </label>
                     <Button type="submit" className='btn btn-success' >Filter</Button>
                   </form>
                 }
                 {
                   <input type="text" id="nameSearch" onKeyUp={this.searchName} style={{display: "inline-block", width: "25%", height: "100%"}} placeholder=
                   "Search for anything you want.."/> 
                 }
                 <div className="export-button">
                 {
                   <ReactToExcel
                    className="btn export"
                    table="tableLog"
                    filename="SensorLog"
                    sheet="shee1"
                    buttonText="">
                   </ReactToExcel>
                 }
                 </div>
                 {
                   <table  id="tableLog" className="tableLog table table-striped table-hover" style={{width: "80%", marginLeft: "10%", marginTop: "5rem"}}>
                   <thead>
                   <tr>
                     <th scope='col'>Time</th>
                     <th scope='col'>Hour</th>
                     <th scope='col'>Value</th>
                     <th scope='col'>Status</th>
                   </tr>
                   </thead>
                  <tbody> {
                     this.renderTableData(moisture)
                  }
                  
                 </tbody>
    
                    
                 </table>
                 }
                 {
                   <div style={{textAlign:'center'}}>
                   <Pagination
                     
                     activePage={this.state.activePage}
                     itemsCountPerPage={10}
                     totalItemsCount={450}
                     pageRangeDisplayed={5}
                     onChange={this.handlePageChange.bind(this)}
                   />
                   </div>
                   
                 }
                 
                 
                  </main>        
               )           
            }}
        </SensorConsumer>
    );
  }
}

export default LogDetail;
