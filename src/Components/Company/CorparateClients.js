import React, { Component } from 'react';
import AddCorparate from './Modals/AddCorparate';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Datatables from '../Datatables';

export default class CorparateClients extends Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: 0,
            clients: [],
            data: {
                name: '',
                address: '',
                mobile: '',
                phone: '',
                email: '',
                website: '',
                note: '',
            },
            display: true
        }
      }
    componentDidMount = () => {
        this.load()
    }
    setData = (name, value) => {
        let newData = this.state.data;
        newData[name] = value
        
        this.setState({
            data: newData
        })
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

        let modal = <AddCorparate edit={edit} data={data} load={this.load} removeComponent={this.removeComponent} />

        this.setState({
            modal: modal
        })
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/clients`)
        if(response.data.status === 'success'){
            this.setState({
                clients: response.data.clients,
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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/clients/${id}`)


        if (response.data.status === 'success') {
            NotificationManager.warning(response.data.message, 'Warning', 5000);
            this.load()
        }
    }
    buttons = (row) => {
        return (
            <div style={{ minWidth: '100px' }}>
                <button className="btn Btn32 btn-warning" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent(row.value)}><i class="fas fa-pencil-alt"></i></button>
                { this.state.delete ? <button className="btn Btn32 btn-danger" onClick={() => this.delete(row.id)}><i class="fas fa-trash"></i></button> : '' }
            </div>
        )
    }  
    render() {
        const status = ['Not Working', 'Active']
        const columns = [
            {
                name: 'Name',
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
                name: 'Status',
                selector: row => row.status,
            },
            {
                name: 'Note',
                selector: row => row.note,
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
        if(this.state.clients.length > 0)
        {
            this.state.clients.map((value, index) => {
                data.push({ 
                    id: value.id, 
                    value: value, 
                    name: value.name, 
                    mobile: value.mobile, 
                    address:  value.address,  
                    email: value.email, 
                    note: value.note, 
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
                            <h4>Corparate Clienst</h4>
                        </div>
                        <div className="col-12 col-sm-6 clearfix">
                            <button type="button" class="btn btn-info  float-right" data-toggle="modal" data-target="#exampleModal" data-whatever="@getbootstrap" onClick={() => this.setState({edit: 0, data: {name: '', address: '',  mobile: '', email: '', phone: '',  website: '', note: ''}})}>Add</button>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12">
                            <div className="bg-white m-0 p-3 rounded shadow">
                                <Datatables columns={columns} data={data} pending={this.state.display} filter={`name`}/>
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
