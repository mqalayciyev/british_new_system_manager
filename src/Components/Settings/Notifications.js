import React, { Component } from 'react'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Link } from "react-router-dom";
import 'react-notifications/lib/notifications.css';


export default class Notifications extends Component {
    constructor(props) {
        super(props)
        this.state = {
            notifications: [],
            display: true
        }
    }
    componentDidMount = () => {
        this.load();
    }
    load = async () => {
        let userInfo = JSON.parse(localStorage.getItem('user-info'))
        axios.interceptors.request.use(
            config => {
                config.headers.authorization = `Bearer ${userInfo.user.token}`;
                return config;
            },
            error => {
                return Promise.reject(error)
            }
        )
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications`)
                    console.log(response.data)
        if (response.data.status === 'success') {

            this.setState({
                leads: response.data.notifications,
                display: false
            })
        }

    }
    render() {
        return (
            <>
                <NotificationContainer />
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <h4>Notifications</h4>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                            <div className="loading" style={{ display: this.state.display ? 'block' : 'none' }}>
                            <div className="text-center">
                                <span>
                                    Loading...
                                </span>
                            </div>
                        </div>
                                <div className="table-responsive bg-white m-0 p-3 rounded shadow">
                                    <table className="table table-bordered m-0">
                                        <thead>
                                            <tr>
                                                <th scope="col">Content</th>
                                                <th scope="col">From</th>
                                                <th scope="col">Created Date</th>
                                                <th scope="col"></th>
                                                {/* <th scope="col"><button className="btn Btn32 text-danger"><i className="fas fa-trash"></i></button></th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.notifications.length > 0 ? this.state.notifications.map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            {value.content}
                                                        </td>
                                                        <td>
                                                            {/* <Link to={`/User/${value.id}`} >{value.first_name} {value.last_name}</Link> */}
                                                            {value.from}
                                                        </td>
                                                        <td>
                                                            {value.created_at}
                                                        </td>
                                                        <td className="btnTD text-center">
                                                            <Link className="nav-link" to={value.url}>
                                                                <i class="fas fa-link"></i>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            }) :
                                                <tr>
                                                    <td colSpan="12" className="text-center">
                                                        Empty
                                                    </td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
