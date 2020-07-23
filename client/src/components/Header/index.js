import React,{ Component} from 'react';
import {Link} from 'react-router-dom';
import wall from './wall.jpg';
import Logout from '../Logout';

class Header extends Component{
    

    render(){
        return (           
            <nav className="navbar navbar-default" role="navigation">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                        <span className="sr-only">Stephen</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                        
                        

                </div>
                <div className="collapse navbar-collapse navbar-ex1-collapse">
                    <ul className="nav navbar-nav navbar-right">
                    
                        <li className="dropdown">
                            <a data-toggle="Stephen"><b><Logout/></b></a>
                        </li>
                    </ul>
                </div>
            </nav>
            
            
        );
    }
}

export default Header;
