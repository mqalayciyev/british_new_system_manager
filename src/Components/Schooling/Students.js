import React, { Component } from 'react'
import { Link } from "react-router-dom";
import AddStudent from './Modals/AddStudent'
import axios from 'axios';
import img from '../../img/profile.jpg';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';


export default class Students extends Component {
    constructor(props) {
        super(props)
        this.state = {
            students: [],
            data: {},
            status: ['Resigned', 'Works', 'Intern', 'On Holiday'],
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/students`)
        console.log(response.data)
        if (response.data.status === 'success') {
            this.setState({
                students: response.data.students,
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
        if(value){
            edit = value.id
            data = value
        }
        
        let modal = <AddStudent edit={edit} data={data} removeComponent={this.removeComponent} load={this.load} />

        this.setState({
            modal: modal
        })
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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/students/${id}`)


        if (response.data.status === 'success') {
            NotificationManager.warning(response.data.message, 'Warning', 5000);
            this.load()
        }
    }
    capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    
    render() {
        
        return (
            <>
            <NotificationContainer />
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <h4>Students</h4>
                            </div>
                            <div className="col-12 col-sm-6 clearfix">
                                <button type="button" class="btn btn-info  float-right" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent()}  data-whatever="@getbootstrap">Add</button>
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
                                                <th scope="col"></th>
                                                <th scope="col">Full name</th>
                                                <th scope="col">Age</th>
                                                <th scope="col">Offices</th>
                                                <th scope="col">Age category</th>
                                                <th scope="col">Lesson</th>
                                                <th scope="col">Group</th>
                                                <th scope="col">Study days</th>
                                                <th scope="col">Date / type of application</th>
                                                <th scope="col">Contacts</th>
                                                <th scope="col">Comment</th>
                                                <th scope="col">Status</th>
                                                <th scope="col"></th>
                                                {/* <th scope="col"><button className="btn Btn32 text-danger"><i class="fas fa-trash"></i></button></th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.students.length > 0 ? this.state.students.map((value, index) => {
                                                const less = JSON.parse(value.lessons)
                                                const study_days = JSON.parse(value.study_days)
                                                let days = []
                                                for (const [keys, value] of Object.entries(study_days)) {
                                                    if(keys !== 'id' && keys !== 'company' && keys !== 'student' && value === 1){
                                                        days.push(<p className="m-0">{this.capitalize(keys)}</p>)
                                                    }
                                                }
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <img className="rounded-circle" style={{ width: '100px', height: '100px' }} src={value.image ? process.env.REACT_APP_URL + '/' + value.image : img} alt='account' />
                                                        </td>
                                                        <td>
                                                            <Link to={`/User/${value.id}`} >{value.user_name}</Link>
                                                        </td>
                                                        <td>
                                                        {value.date}
                                                        </td>
                                                        <td>
                                                            {value.office_name}
                                                        </td>
                                                        <td>
                                                            {value.age_cat_title}
                                                        </td>
                                                        
                                                        <td>
                                                        {
                                                            less.map((v, i) => {
                                                                return <p className="m-0">{v.label}</p>
                                                            })
                                                        }
                                                        </td>
                                                        <td>
                                                            {value.group_name}
                                                        </td>
                                                        <td>
                                                            {days}
                                                        </td>
                                                        <td>
                                                            {value.created_at}
                                                        </td>
                                                        <td>
                                                            <p className="m-0 p-0">{value.mobile}</p>
                                                            <p className="m-0 p-0">{value.phone}</p>
                                                            <p className="m-0 p-0">{value.email}</p>
                                                            <p className="m-0 p-0"><i>{value.address}</i></p>
                                                        </td>
                                                        <td>
                                                            {value.note}
                                                        </td>
                                                        <td>
                                                            {this.state.status[value.status]}
                                                        </td>
                                                        <td className="btnTD text-center">
                                                            <Link to={`/MessagesUser/${value.id}`} className="btn Btn32 btn-success mx-1"><i class="fas fa-comment"></i></Link>
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
