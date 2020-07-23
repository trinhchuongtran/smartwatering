import React from "react";
import  {Redirect, Route} from "react-router-dom";

const PrivateRoute = ({isLoggedIn, ...props}) =>
    // console.log(isLoggedIn)
    isLoggedIn ? <Route { ...props}/> : <Redirect to='/login'/>
// }

export default PrivateRoute