import React, { Component } from 'react'
import Add from './Add';
import Notes from './Notes';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Datatables from '../Datatables';



export default class Leads extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leads: [],
            display: true
        }
    }
    componentDidMount = () => {
        this.load()
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

        let modal = <Add edit={edit} data={data} load={this.load} removeComponent={this.removeComponent} />

        this.setState({
            modal: modal
        })
    }
    notes = (id) => {

        let modal = <Notes leads={id} removeComponent={this.removeComponent} />
        this.setState({
            modal: modal
        })
    }
    addStudent = async id => {
        var password = prompt("Please set a password for select leads.");
        if(password != null){
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
            let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/addStudent/${id}`, {password: password})
            console.log(response.data)
            if(response.data.status === 'success'){
                NotificationManager.success('Leads telebeler siyahisina elave edildi', 'Success', 5000);
            }
            else{
                let message = response.data.message;
                for (const [key, value] of Object.entries(message)) {
                    console.log(key)
                    NotificationManager.error(value, 'Error', 5000);
                }
            }
        }
        else{
            NotificationManager.warning('Sifre teyin edilmedi.', 'Warning', 5000);
        }
        
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/leads`)
        if(response.data.status === 'success'){
            this.setState({
                leads: response.data.leads,
                delete: userInfo.user.user_info.type === 1 ? true : false,
                display: false
            })
        }
        
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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/leads/${id}`)


        if (response.data.status === 'success') {
            NotificationManager.warning(response.data.message, 'Warning', 5000);
            this.load()
        }
    }
    buttons = (row) => {
        return (
            <div style={{ minWidth: '250px' }}>
                <button className="btn Btn32 btn-warning" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent(row.value)}><i className="fas fa-pencil-alt"></i></button>
                <button className="btn Btn32 btn-info" onClick={() => this.addStudent(row.id)}><i className="fas fa-user-plus"></i></button>
                <button className="btn Btn32 btn-primary" data-toggle="modal" data-target="#notesModal" onClick={() => this.notes(row.id)}><i className="fas fa-clipboard-list"></i></button>
                { this.state.delete ? <button className="btn Btn32 btn-danger" onClick={() => this.delete(row.id)}><i className="fas fa-trash"></i></button> : '' }
            </div>
        )
    }
    render() {
        const columns = [
            {
                name: 'Lead Name',
                sortable: true,
                selector: row => row.title,
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
                name: 'Leads purpose',
                selector: row => row.purpose,
            },
            {
                name: 'Leads owner',
                sortable: true,
                selector: row => row.owner,
            },
            {
                name: 'Leads source',
                selector: row => row.source,
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
        if(this.state.leads.length > 0)
        {
            this.state.leads.map((value, index) => {
                data.push({ 
                    id: value.id, 
                    value: value, 
                    title: value.name, 
                    mobile: value.mobile, 
                    address:  value.address,  
                    email: value.email, 
                    owner: value.owner, 
                    purpose: value.purpose, 
                    source: value.source, 
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
                                <h4>Leads</h4>
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
                {/* { <Add edit={this.state.edit} data={this.state.data} load={this.load} setData={this.setData} />} */}
            </>
        )
    }
}
