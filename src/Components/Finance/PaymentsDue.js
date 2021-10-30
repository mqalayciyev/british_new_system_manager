import React, { Component } from 'react'
import axios from 'axios';

export default class PaymentsDue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            due: [],
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
        let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/payments/due`)
        console.log(response.data)
        if (response.data.status === 'success') {
            this.setState({
                due: response.data.payments,
                display: false
            })
        }
    }
    render() {
        const status = ['Graduated from training', 'Is engaged in', 'Will continue']
        return (
            <>
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 col-sm-6">
                            <h4>Payments</h4>
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
                                            <th scope="col">Full name</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Lesson</th>
                                            <th scope="col">Office</th>
                                            <th scope="col">Paid</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Phone</th>
                                            <th scope="col">Debt</th>
                                            
                                            {/* <th scope="col"></th> */}
                                            {/* <th scope="col"><button className="btn Btn32 text-danger"><i class="fas fa-trash"></i></button></th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.due.length > 0 ? this.state.due.map((value, index) => {
                                                return (
                                                    <tr key={index} className="alert alert-danger">
                                                        <td>
                                                            {value.student_name}
                                                        </td>
                                                        <td>
                                                        {status[value.student_status]}
                                                        </td>
                                                        <td>
                                                        {value.lesson_title}
                                                            
                                                        </td>
                                                        <td>
                                                        {value.office_name}
                                                        </td>
                                                        <td>
                                                        {value.payment_value}
                                                        </td>
                                                        <td>
                                                        {value.student_email}
                                                        </td>
                                                        <td>
                                                        {value.student_mobile}
                                                        </td>
                                                        <td>
                                                        {value.payment_due}
                                                        </td>
                                                        
                                                        {/* <td className="btnTD text-center"> */}
                                                            {/* <p className="m-0 p-0"><button className="btn Btn32 btn-warning mx-1"><i className="far fa-list-alt"></i></button></p> */}

                                                            {/* <button className="btn Btn32 btn-warning mx-1" data-toggle="modal" data-target="#exampleModal" onClick={() => this.addComponent(value)}><i className="fas fa-pencil-alt"></i></button> */}
                                                            {/* <button className="btn Btn32 btn-danger" data-id={value.id} data-link="lesson" onClick={this.delete}><i class="fas fa-trash"></i></button> */}

                                                        {/* </td> */}
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
            {/* <AddPaymentDue /> */}
            </>
        )
    }
}
