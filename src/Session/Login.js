import { Component } from 'react'
import {
    Link
} from "react-router-dom";
// import $ from 'jquery';
import axios from 'axios';
import serialize from 'form-serialize';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SessionContext } from "../Context/Session";

const $ = window.$;

export default class Login extends Component {
    static contextType = SessionContext;
    constructor(props) {
        super(props)
        this.state = {email: '', password: '', response: []};
    }
    handleSetState = event => {
        this.setState({
            [event.target.name]: [event.target.value]
        })
    }
    
    login = async event => {
        
        event.preventDefault();

        

        var data = serialize($(event.target)[0], { hash: true })

        let response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, data)

        response = response.data

        console.log(response)
        if(response.status === 'success'){
            NotificationManager.success('Giriş uğurlu', 'Success', 5000);
            localStorage.setItem('user-info', JSON.stringify(response.session))
            this.context.setSession(response.status, response.session)
            window.location.href = '/'
        }
        if(response.status === 'warning'){
            let message = response.message;
            for (const [key, value] of Object.entries(message)) {
                NotificationManager.warning(value, 'Warning', 5000);
            }
        }
        if(response.status === 'error'){
            let message = response.message;
            for (const [key, value] of Object.entries(message)) {
                NotificationManager.error(value, 'Error', 5000);
            }
        }
        
    }
    render() {
        return (
            <div className="hold-transition login-page">
                <NotificationContainer/>
                
                <div class="login-box">
                    <div class="card card-outline card-primary">
                        <div class="card-header text-center">
                            <p class="h1 m-0"><b>Admin</b>Panel</p>
                        </div>
                        <ul>
                        </ul>
                        <div class="card-body">
                            <p class="login-box-msg">Sessiyanıza başlamaq üçün daxil olun</p>
                            <form id="login-form" onSubmit={this.login}>
                                <input type="hidden" name="login" value="1"/>
                                <div class="input-group mb-3">
                                    <input type="email" class="form-control" name="email" value={this.state.email} onChange={this.handleSetState} placeholder="Email" />
                                    <div class="input-group-append">
                                        <div class="input-group-text">
                                            <span class="fas fa-envelope"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="input-group mb-3">
                                    <input type="password" class="form-control" name="password" value={this.state.password} onChange={this.handleSetState} placeholder="Şifrə" />
                                    <div class="input-group-append">
                                        <div class="input-group-text">
                                            <span class="fas fa-lock"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-8">
                                        <div class="icheck-primary">
                                            <input type="checkbox" value="1" name="rememberme" id="remember" />
                                            <label for="remember">
                                                Məni xatırla
                                        </label>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <button type="submit" class="btn btn-primary btn-block">Giriş</button>
                                    </div>
                                </div>
                            </form>


                            <p class="mb-1">
                                <Link to="/ForgotPassword">Şifrəmi unutmuşam</Link>

                            </p>
                            {/* <p class="mb-0">
                                <Link to="/Register">Qeydiyyat</Link>
                            </p> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
