import React, { Component } from 'react'
// import { Link } from "react-router-dom";
import AddPayment from './Modals/AddPayment'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class Payments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            payments: [],
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

        let modal = <AddPayment edit={edit} data={data} load={this.load} removeComponent={this.removeComponent} />

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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/payments`)
        console.log(response.data)
        if (response.data.status === 'success') {
            this.setState({
                payments: response.data.payments,
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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/payments/${id}`)


        if (response.data.status === 'success') {
            NotificationManager.warning(response.data.message, 'Warning', 5000);
            this.load()
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
                                <h4>Payments</h4>
                            </div>
                            <div className="col-12 col-sm-6 clearfix">
                                <button type="button" class="btn btn-info  float-right" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent()}>Add</button>
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
                                                <th scope="col">Office</th>
                                                <th scope="col">Adding date</th>
                                                <th scope="col">Lesson</th>
                                                <th scope="col">Payer</th>
                                                <th scope="col">Payment value</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Comment</th>
                                                <th scope="col">Status</th>
                                                <th scope="col"></th>
                                                {/* <th scope="col"><button className="btn Btn32 text-danger"><i class="fas fa-trash"></i></button></th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.payments.length > 0 ? this.state.payments.map((value, index) => {
                                                return (
                                                    <tr key={index} className={`${value.payment_due < 0 ? 'alert alert-danger' : ''}`}>
                                                        <td>
                                                            {value.office_name}
                                                        </td>
                                                        <td>
                                                            {value.created_at}
                                                        </td>
                                                        <td>
                                                            {value.lesson_title}
                                                        </td>
                                                        <td>
                                                            {value.student_name}
                                                        </td>
                                                        <td>
                                                        {value.payment_value}
                                                        </td>
                                                        <td>
                                                        {value.price}
                                                        </td>
                                                        <td>
                                                        {value.note}
                                                        </td>
                                                        <td>
                                                        {value.status}
                                                        </td>
                                                        <td className="btnTD text-center">
                                                            <button className="btn Btn32 btn-warning mx-1" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent(value)}><i className="fas fa-pencil-alt"></i></button>
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
