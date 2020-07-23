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

  handleLogin = async (e) => {
    e.preventDefault();
    // console.log(123346678)
    await this.setState({
      username:this.state.username,
      password:this.state.password,
    })
    // console.log(this.state.username)
    await fetch("/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username: this.state.username, password: this.state.password})
    }).then(value => {
      value.json().then(db => {
          // console.log(db)
          this.setState({userFound: db['check']})
      })
  })
  }

  componentDidMount(){
    
  }

  render() {
    if(this.state.userFound){
      Cookies.set('username', this.state.username)
      return <Redirect to="/listArea" />
    }
    // console.log(Cookies.get('username'))
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
            Cookies.set("username", e.target.value)
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
        {/* <Link to="/listArea" onClick={()=> Cookies.set("username", "trinhtran")}> */}
        <button
          onClick={this.handleLogin}
          >LOGIN
        </button>
        {/* </Link> */}
        <br />
      </div>
    </div>
    )
  }
};

export default Login