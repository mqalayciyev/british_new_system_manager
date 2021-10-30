import React, { Component } from 'react'

import { SessionContext } from "./Context/Session";

import App from './App';
import Session from './Session/Session';



export default class Master extends Component {
    static contextType = SessionContext;

    render() {
        return (
            <SessionContext.Consumer>
                {() => {
                    if(localStorage.getItem("user-info") !== null){
                        return <App />
                    }
                    else{
                        return <Session/>
                    }
                }}
            </SessionContext.Consumer>
        )



    }
}
