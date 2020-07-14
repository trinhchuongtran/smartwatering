import React, {Component} from "react";
import { Redirect, Link} from "react-router-dom";
import "./style.css";
import Cookies from 'js-cookie'

class Login extends Component {
  constructor(){
    super()
    this.state={
      username:null,
      password:null,
      userFound: false
    }
  }

  // componentDidMount(){
  //   Cookies.remove('username');
  // }

  render() {
    if(this.state.userFound){
      Cookies.set('username', this.state.username)
      return <Redirect to="/listArea" />
    }
    let username
    let password
     return (
      <div>
      <div className="background"></div>
      <div className="grad"></div>
      <div className="header">
        <div>Penta<span>T</span></div>
      </div>
      <br />
      <div className="login">
        <input
          id="username"
          type="text"
          placeholder="username"
          name="user"
          onChange={(e)=>{
            this.setState({
              username:e.target.value,
              password:this.state.password,
              userFound: this.state.userFound
            })
          }}
        />
        <br />
        <input
          id="password"
          type="password"
          placeholder="password"
          name="password"
          onChange={(e)=>{
            this.setState({
              username:this.state.username,
              password:e.target.value,
              userFound: this.state.userFound
            })
          }}
        />
        <br />
        <button
          onClick={async ()=>{
            await this.setState({
              username:this.state.username,
              password:this.state.password,
            })
            await fetch("/login", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({username: this.state.username, password: this.state.password})
            }).then(value => {
              value.json().then(db => {
                  console.log(db)
                  this.setState({userFound: db['check']})
              })
          })
          }}
          >LOGIN
        </button>
        <br />
      </div>
    </div>
    )
  }
};

export default Login