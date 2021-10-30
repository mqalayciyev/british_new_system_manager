import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip';
import axios from 'axios';
import { Link } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
export default class AttendanceMap extends Component {
    constructor(props) {
        super(props)
        this.state = { display: true, attendance: []};
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/attendance`)
        if (response.data.status === 'success') {
            console.log(response.data)
            this.setState({
                attendance: response.data.attendance,
                display: false
            })
        }

    }
    date(value) {
        let date = new Date(value)
        return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
    }
    render() {
        return (
            <>
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-12">
                            <h4>Exams</h4>
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
                                            <th scope="col">Teacher</th>
                                            <th scope="col">Lesson</th>
                                            <th scope="col">Attendance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    
                                        {this.state.attendance.length > 0 ? this.state.attendance.map((value, index) => {
                                                const attendance_days = JSON.parse(value.attendance_days)
                                                console.log(value.attendance_days)
                                                let days = []
                                                for (const [keys, value] of Object.entries(attendance_days)) {
                                                    let bg = value.status ? 'bg-success' : 'bg-danger'
                                                    let date = this.date(value.created_at)
                                                    days.push(<li class={`list-group-item ${bg}`}>{date}</li>)
                                                }
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <Link to={`/User/${value.student}`} >{value.student_name}</Link>
                                                        </td>
                                                        <td>
                                                            <Link to={`/User/${value.teacher}`} >{value.teacher_name}</Link>
                                                        </td>
                                                        <td>
                                                            {value.lesson_name}
                                                        </td>
                                                        <td>
                                                            <ul class="list-group list-group-horizontal">
                                                                {days}
                                                            </ul>
                                                            
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
