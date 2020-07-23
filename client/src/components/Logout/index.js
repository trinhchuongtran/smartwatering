import React, {Component} from "react";
import {Button} from 'reactstrap';
import Cookies from 'js-cookie';
import {Redirect, Route} from "react-router-dom";


class Logout extends Component{
    componentWillMount(){
        this.setState({username: Cookies.get('username')})
    }

    render(){
        if(this.state.logout){
            Cookies.remove();
            return <Redirect to='/login'/>
        }
        return(
            <Button onClick={() => this.setState({logout: true, username: undefined})}>
                {this.state.username}
            </Button>
        )
    }
}

export default Logout;