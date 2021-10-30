import React, { Component } from 'react'
import AddPrivateLessons from './Modals/AddPrivateLessons'
import { Link } from "react-router-dom";
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';


export default class PrivateLessons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            private: [],
            data: {},
            display: true
        }
    }
    componentDidMount = () => {
        this.load()
    }
    load = async name => {
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/private`)
        if (response.data.status === 'success') {
            console.log(response.data)
            this.setState({
                private: response.data.private,
                delete: userInfo.user.user_info.type === 1 ? true : false,
                display: false
            })
        }


    }
    removeComponent = () => {
        this.setState({
            modal: []
        })
    }
    addComponent = (value) => {
        let edit = 0
        let data = {}
        if (value) {
            edit = value.id
            data = value
        }

        let modal = <AddPrivateLessons edit={edit} data={data} removeComponent={this.removeComponent} load={this.load} />

        this.setState({
            modal: modal
        })
    }
    capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    delete = async id => {
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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/private/${id}`)


        if (response.data.status === 'success') {
            NotificationManager.warning(response.data.message, 'Warning', 5000);
            this.load()
        }
    }
    render() {
        let userInfo = JSON.parse(localStorage.getItem('user-info'))
        const status = ['', 'Actual', 'Complete']
        return (
            <>
            <NotificationContainer />
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <h4>Private lessons</h4>
                            </div>
                            <div className="col-12 col-sm-6 clearfix">
                                <button type="button" class="btn btn-info  float-right" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent()} data-whatever="@getbootstrap">Add</button>
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
                                    <table class="table table-bordered m-0">
                                        <thead>
                                            <tr>
                                                <th scope="col">Student</th>
                                                <th scope="col">Lesson</th>
                                                <th scope="col">Office</th>
                                                <th scope="col">Level</th>
                                                <th scope="col">Age Category</th>
                                                <th scope="col">Hours</th>
                                                <th scope="col">Study days</th>
                                                <th scope="col">Teachers</th>
                                                <th scope="col">Hourly Rate</th>
                                                <th scope="col">Status</th>
                                                <th scope="col"></th>
                                                {/* <th scope="col"><button className="btn Btn32 text-danger"><i class="fas fa-trash"></i></button></th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.private.length > 0 ? this.state.private.map((value, index) => {
                                                const hours_price = JSON.parse(value.hours_price)
                                                const study_days = JSON.parse(value.study_days)
                                                let total_price = value.hours * 60 * hours_price[0].price / hours_price[0].minutes
                                                let days = []
                                                for (const [keys, value] of Object.entries(study_days)) {
                                                    if(keys !== 'id' && keys !== 'company' && keys !== 'private' && value === 1){
                                                        days.push(<p className="m-0">{this.capitalize(keys)}</p>)
                                                    }
                                                }
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            { <p className="m-0"><Link to={`/Users?user=${value.student}`}>{value.student_name}</Link> </p>}
                                                        </td>
                                                        <td>
                                                            {value.lesson_title}
                                                        </td>
                                                        <td>
                                                            {value.office_name}
                                                        </td>
                                                        <td>
                                                            {value.level_title}
                                                        </td>

                                                        <td>
                                                            {value.age_category_title}
                                                        </td>
                                                        <td>
                                                            {value.hours}
                                                        </td>
                                                        <td>
                                                            {days}
                                                        </td>
                                                        <td>
                                                            <p className="m-0"><Link to={`/Users?user=${value.teacher}`}>{value.teacher_name}</Link> </p>
                                                        </td>
                                                        <td>
                                                            <p>({hours_price[0].minutes}min - {hours_price[0].price})</p>
                                                            <p>(Total: {total_price + userInfo.company.currency})</p>
                                                        </td>
                                                        <td>
                                                            {status[value.status]}
                                                        </td>
                                                        <td className="btnTD text-center">
                                                            <button className="btn Btn32 btn-warning mx-1" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent(value)}><i class="fas fa-pencil-alt"></i></button>
                                                            {
                                                                this.state.delete ? <button className="btn Btn32 btn-danger" onClick={() => this.delete(value.id)}><i class="fas fa-trash"></i></button> : ''
                                                            }
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
                {
                    this.state.modal
                }
            </>
        )
    }
}
