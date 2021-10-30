import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Route
} from "react-router-dom";
import Login from './Login';
// import Register from './Register';
import ForgotPassword from './ForgotPassword';
import RecoveryPassword from './RecoveryPassword';
import NotFound from '../NotFound';

export default class Session extends Component {
    render() {
        return (
            <Router>
                <Redirect from="/" to="/Login" />
                <Switch>
                    
                    <Route path={`/Login`} exact>
                        <Login />
                    </Route>
                    {/* <Route path={`/Register`}>
                        <Register />
                    </Route> */}
                    <Route path={`/ForgotPassword`}>
                        <ForgotPassword />
                    </Route>
                    <Route path={`/RecoveryPassword`}>
                        <RecoveryPassword />
                    </Route>
                    <Route component={NotFound} />
                </Switch>
            </Router>
        )
    }
}
