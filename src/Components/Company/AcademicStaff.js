import React, { Component } from 'react'
import AddAcademicStaff from './Modals/AddAcademicStaff'
import { Link } from "react-router-dom";
import axios from 'axios';
import img from '../../img/profile.jpg';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Datatables from '../Datatables';

export default class AcademicStaff extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: [],
            teachers: [],
            display: true,
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/teacher`)
        if (response.data.status === 'success') {
            this.setState({
                teachers: response.data.teachers,
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
        console.log(value)
        let edit = 0
        let data = {}
        if (value) {
            edit = value.id
            data = value
        }

        let modal = <AddAcademicStaff edit={edit} data={data} load={this.load} removeComponent={this.removeComponent} offices={this.state.offices} salary={this.state.salary} levels={this.state.levels} lessons={this.state.lessons} />

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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/teacher/${id}`)


        if (response.data.status === 'success') {
            NotificationManager.warning(response.data.message, 'Warning', 5000);
            this.load()
        }
    }
    buttons = (row) => {
        return (
            <div style={{ minWidth: '380px' }}>
                <Link to={`/Messages/Chat/${row.id}`} className="btn Btn32 btn-success"><i className="fas fa-comment"></i></Link>
                <button className="btn Btn32 btn-warning" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent(row.value)}><i className="fas fa-pencil-alt"></i></button>
                <button className="btn Btn32 btn-primary"><i className="fas fa-calendar-alt"></i></button>
                { this.state.delete ? <button className="btn Btn32 btn-danger" onClick={() => this.delete(row.id)}><i class="fas fa-trash"></i></button> : '' }
            </div>
        )
    }
    render() {
        const status = ['Resigned', 'Works', 'Intern', 'On Holiday']
        const columns = [
            {
                name: 'Image',
                selector: row => row.image,
            },
            {
                name: 'Full name',
                sortable: true,
                selector: row => row.name,
            },
            {
                name: 'Mobile',
                selector: row => row.mobile,
            },
            {
                name: 'Address',
                selector: row => row.address,
            },
            {
                name: 'Email',
                selector: row => row.email,
            },
            {
                name: 'Lessons',
                selector: row => row.lessons,
            },
            {
                name: 'Levels',
                sortable: true,
                selector: row => row.levels,
            },
            {
                name: 'Office',
                selector: row => row.office,
            },
            {
                name: 'Status',
                selector: row => row.status,
            },
            {
                name: 'Created at',
                sortable: true,
                selector: row => row.created_at,
            },
            {
                name: '',
                selector: row => this.buttons(row),
            },
        ];
        const data = []
        if(this.state.teachers.length > 0)
        {
            this.state.teachers.map((value, index) => {
                const lessons = JSON.parse(value.lessons1)
                const levels = JSON.parse(value.levels1)
                data['lessons'] = lessons
                data['levels'] = levels
                const les = []
                const lev = []
                lessons.map((v, i) => {
                    les.push(<p className="m-0">{v.label}</p>)
                })
                levels.map((v, i) => {
                    lev.push(<p className="m-0">{v.label}</p>) 
                })
                data.push({ 
                    id: value.id, 
                    value: value, 
                    image: <img className="rounded-circle h-100 w-100" style={{ maxWidth: '100px', maxHeight: '100px' }} src={value.image ? process.env.REACT_APP_URL + '/' + value.image : img} alt='account' />,
                    title: value.first_name + ' ' +value.last_name, 
                    name: <Link to={`/User/${value.id}`} >{value.first_name} {value.last_name}</Link>, 
                    mobile: value.mobile, 
                    address:  value.address,  
                    email: value.email, 
                    levels: lev, 
                    lessons: les, 
                    office: value.office_name, 
                    status: status[value.status], 
                    created_at: value.created_at,
                })
            })
        }
        return (
            <>
                        <NotificationContainer />
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <h4>Academic staff</h4>
                            </div>
                            <div className="col-12 col-sm-6 clearfix">
                                <button type="button" className="btn btn-info  float-right" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent()}>Add</button>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="bg-white m-0 p-3 rounded shadow">
                                    <Datatables columns={columns} data={data} pending={this.state.display} filter={`title`}/>
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
