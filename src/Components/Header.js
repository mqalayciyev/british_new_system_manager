import React, { Component } from 'react';
// import user1 from 'admin-lte/dist/img/user1-128x128.jpg'
// import user8 from 'admin-lte/dist/img/user8-128x128.jpg'
// import user3 from 'admin-lte/dist/img/user3-128x128.jpg'
import axios from 'axios';
import { Link } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SessionContext } from "../Context/Session";
import createHistory from 'history/createBrowserHistory'
// import user2 from 'admin-lte/dist/img/user2-160x160.jpg'


export default class Header extends Component {
    static contextType = SessionContext;
    constructor(props) {
        super(props)
        this.history = createHistory()
        this.state = { notifications: 0, messages: 0 };
    }

    // componentDidMount = () => {
    //     setInterval(async () => {
    //         let userInfo = JSON.parse(localStorage.getItem('user-info'))
    //         axios.interceptors.request.use(
    //             config => {
    //                 config.headers.authorization = `Bearer ${userInfo.user.token}`;
    //                 return config;
    //             },
    //             error => {
    //                 return Promise.reject(error)
    //             }
    //         )
    
    //         let messages = await axios.get(`${process.env.REACT_APP_API_URL}/managers/messages`)
    //         let notifications = await axios.get(`${process.env.REACT_APP_API_URL}/notifications`)
    //         if (messages.data.status === 'success') {
    //                 this.setState({ messages: messages.data.count })
    //         }
    //         if (notifications.data.status === 'success') {
    //             this.setState({ notifications: notifications.data.count })
    //         }
    //     }, 5000);
    // }

    

    logout = async (e) => {
        e.preventDefault()

        let userInfo = JSON.parse(localStorage.getItem('user-info'))
        console.log(userInfo.user)
        axios.interceptors.request.use(
            config => {
                config.headers.authorization = `Bearer ${userInfo.user.token}`;
                return config;
            },
            error => {
                return Promise.reject(error)
            }
        )

        let response = await axios.post(`${process.env.REACT_APP_API_URL}/logout`)
        if (response.data.status === 'sign_out') {
            localStorage.removeItem('user-info')
            this.context.setSession(response.status, '')
            window.location.href = '/'
        }
        else {
            NotificationManager.error('The operation failed.', 'Error', 5000);
        }

    }
    render() {
        return (
            <>
                <NotificationContainer />
                <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" data-widget="pushmenu" href={'void(0)'}><i className="fas fa-bars"></i></a>
                        </li>
                    </ul>

                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown">
                            <Link className="nav-link" to="Messages">
                                <i className="far fa-comments"></i>
                                <span className="badge badge-danger navbar-badge">{this.state.messages}</span>
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link" to="Notifications">
                                <i className="far fa-bell"></i>
                                <span className="badge badge-warning navbar-badge">{this.state.notifications}</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <span className="nav-link" onClick={(e) => this.logout(e)} style={{ cursor: 'pointer' }}>
                                Sign out
                            </span>
                        </li>
                        {/* <li>
                            <li class="nav-item">
                                <a class="nav-link" data-widget="control-sidebar" data-slide="true" href="#" role="button"><i
                                    class="fas fa-th-large"></i></a>
                            </li>
                        </li> */}
                    </ul>

                </nav>
            </>
        )
    }
}
