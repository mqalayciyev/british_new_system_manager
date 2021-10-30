import React, { Component } from 'react'
import { Link } from "react-router-dom";
import AddAdministrativeStaff from './Modals/AddAdministrativeStaff'
import axios from 'axios';
import img from '../../img/profile.jpg';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Datatables from '../Datatables';


export default class AdministrativeStaff extends Component {
    constructor(props) {
        super(props)
        this.state = {
            managers: [],
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

        let modal = <AddAdministrativeStaff edit={edit} data={data} load={this.load} removeComponent={this.removeComponent} />

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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/manager`)
        if (response.data.status === 'success') {
            this.setState({
                managers: response.data.managers,
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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/manager/${id}`)


        if (response.data.status === 'success') {
            NotificationManager.warning(response.data.message, 'Warning', 5000);
            this.load()
        }
    }
    buttons = (row) => {
        return (
            <div style={{ minWidth: '380px' }}>
                <Link to={`/Messages/Chat/${row.id}`} className="btn Btn32 btn-success mx-1"><i class="fas fa-comment"></i></Link>
                
                { this.state.delete ? (
                    <>
                    <button className="btn Btn32 btn-warning mx-1" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent(row.value)}><i class="fas fa-pencil-alt"></i></button>
                    <button className="btn Btn32 btn-danger" onClick={() => this.delete(row.id)}><i class="fas fa-trash"></i></button>
                    </>
                ) : '' }
            </div>
        )
    }                   
    render() {
        const role = ['', 'Manager', 'Teacher', 'Student', 'Coordinator']
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
                name: 'Role',
                selector: row => row.role,
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
        if(this.state.managers.length > 0)
        {
            this.state.managers.map((value, index) => {
                data.push({ 
                    id: value.id, 
                    value: value, 
                    image: <img className="rounded-circle h-100 w-100" style={{ maxWidth: '100px', maxHeight: '100px' }} src={value.image ? process.env.REACT_APP_URL + '/' + value.image : img} alt='account' />,
                    title: value.first_name + ' ' +value.last_name, 
                    name: <Link to={`/User/${value.id}`} >{value.first_name} {value.last_name}</Link>, 
                    mobile: value.mobile, 
                    address:  value.address,  
                    email: value.email, 
                    role: role[value.type], 
                    office: value.name, 
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
                                <h4>Adminitrative staff</h4>
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
