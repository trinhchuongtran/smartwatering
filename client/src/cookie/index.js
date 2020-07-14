import React from 'react';
import App from '../containers/App';
import {CookesProvider} from 'react-cookie';

export default function Root(){
    return(
        <CookesProvider>
            <App/>
        </CookesProvider>
    )
}