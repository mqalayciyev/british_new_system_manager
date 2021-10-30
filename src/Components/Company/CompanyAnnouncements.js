import React, { Component } from 'react'
import AddAnnouncements from './Modals/AddAnnouncements'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Datatables from '../Datatables';

export default class CompanyAnnouncements extends Component {

    constructor(props) {
        super(props)
        this.state = {
            announcements: [],
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/announcements`)
        if (response.data.status === 'success') {
            this.setState({
                announcements: response.data.announcements,
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

        let modal = <AddAnnouncements edit={edit} data={data} load={this.load} removeComponent={this.removeComponent} />

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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/announcements/${id}`)


        if (response.data.status === 'success') {
            NotificationManager.warning(response.data.message, 'Warning', 5000);
            this.load()
        }
    }
    buttons = (row) => {
        return (
            <div style={{ minWidth: '380px' }}>
                <button className="btn Btn32 btn-warning mx-1" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent(row.value)}><i class="fas fa-pencil-alt"></i></button>
                { this.state.delete ? <button className="btn Btn32 btn-danger" onClick={() => this.delete(row.id)}><i class="fas fa-trash"></i></button> : '' }
            </div>
        )
    }  
    render() {
        const role = ['', 'Manager', 'Teacher', 'Student', 'Coordinator']
        const status = ['Resigned', 'Works', 'Intern', 'On Holiday']
        const columns = [
            {
                name: 'Added date',
                sortable: true,
                selector: row => row.date,
            },
            {
                name: 'Created by',
                sortable: true,
                selector: row => row.created_by,
            },
            {
                name: 'Body',
                selector: row => row.body,
            },
            {
                name: 'Share with',
                selector: row => row.share,
            },
            {
                name: '',
                selector: row => this.buttons(row),
            },
        ];
        const data = []
        if(this.state.announcements.length > 0)
        {
            this.state.announcements.map((value, index) => {
                const share_with = []
                if (value.manager) {
                        share_with.push({ value: 2, label: 'Manager' })
                }
                if (value.teacher) {
                    share_with.push({ value: 3, label: 'Teacher' })
                }
                if (value.student) {
                    share_with.push({ value: 4, label: 'Student' })
                }
                value['share_with'] = share_with
                const share = [(value.teacher) ? <p className="m-0">Teacher</p> : null, (value.manager) ? <p className="m-0">Manager</p> : null, (value.student) ? <p className="m-0">Student</p> : null]
                data.push({ 
                    id: value.id, 
                    value: value, 
                    created_by: value.user_name, 
                    body: value.note, 
                    share_with:  share_with,  
                    share:  share,  
                    date: value.updated_at,
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
                                <h4>Company announcements</h4>
                            </div>
                            <div className="col-12 col-sm-6 clearfix">
                                <button type="button" class="btn btn-info  float-right" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent()}>Add</button>
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
