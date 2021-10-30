import React, { Component } from 'react'
import { Accordion, Card, Button } from 'react-bootstrap'
import { NavLink } from "react-router-dom";
import axios from 'axios';
import Add from '../MyTasks/Add';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
export default class Tasks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tasks: [],
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
    changeStatus = async (id) => {
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
        let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/tasks/status/${id}`)
        // console.log(response.data)
        if (response.data.status === 'success') {
            NotificationManager.success('Task statusu deyisdirildi', 'Success', 5000);
            this.load()
        }
        else {
            NotificationManager.error('Xeta bas verdi', 'Error', 5000);
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/tasks`)
        if (response.data.status === 'success') {
            this.setState({
                tasks: response.data.tasks,
                delete: userInfo.user.user_info.type === 1 ? true : false
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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/tasks/${id}`)


        if (response.data.status === 'success') {
            NotificationManager.warning(response.data.message, 'Warning', 5000);
            this.load()
        }
    }
    render() {
        return (
            <>
                <div style={{ display: 'flex', minWidth: '16px' }}>
                    <Accordion className="col px-3" >
                        <Card style={{ borderRadius: '4px 4px 0px 0px' }}>
                            <Card.Header className="card-header bg-primary" >
                                <Accordion.Toggle as={Button} variant="link" eventKey="0" className="text-white clearfix w-100 text-left" onClick={() => this.setState({ body: !this.state.body })}>
                                    Tasks
                                    <span className="float-right" style={{ cursor: 'pointer', userSelect: 'none' }}><i class={(this.state.body) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'}></i></span>
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <div className="table-responsive bg-white m-0 p-3 rounded shadow">
                                        <table className="table table-bordered m-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Execution date</th>
                                                    <th scope="col">Description</th>
                                                    <th scope="col">Client</th>
                                                    <th scope="col">Client Contact</th>
                                                    <th scope="col">Purpose</th>
                                                    <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.tasks.length > 0 ? this.state.tasks.map((value, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                Start:
                                                                <p className="text-success">{value.start_date}, {value.start_time}</p>
                                                                End:
                                                                <p className="text-danger">{value.end_date}, {value.end_time}</p>
                                                            </td>
                                                            <td>
                                                                {value.note}
                                                            </td>
                                                            <td>
                                                                {value.client}
                                                            </td>
                                                            <td>
                                                                <p>{value.mobile}</p>
                                                                <p>{value.email}</p>
                                                            </td>
                                                            <td>
                                                                {value.purpose}
                                                            </td>
                                                            <td className="btnTD text-center">
                                                                <button className="btn Btn32 btn-success" onClick={() => this.changeStatus(value.id)}><i className="far fa-thumbs-up"></i></button>
                                                                <button className="btn Btn32 btn-warning" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent(value)}><i className="fas fa-pencil-alt"></i></button>
                                                                {/* <button className="btn Btn32 btn-info"><i className="fas fa-eye"></i></button> */}
                                                                {
                                                                    this.state.delete ? <button className="btn Btn32 btn-danger" onClick={() => this.delete(value.id)}><i className="fas fa-trash"></i></button> : ''
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
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
                {
                    this.state.modal
                }
            </>
        )
    }
}
