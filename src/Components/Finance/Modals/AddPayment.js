import React, { Component } from 'react'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class AddPayment extends Component {

    constructor(props) {
        super(props)
        this.state = {
            offices: [],
            payer: [],
            lessons: [],
        }
    }

    componentDidMount = async () => {
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
        if (this.props.edit > 0) {
            this.getLesson(this.props.data.payer)
        }
        
        let payer_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/students`)
        console.log(payer_res.data)
        if (payer_res.data.status === 'success') {
            this.setState({
                payer: payer_res.data.students
            })
        }

        let data = this.props.data
        this.setState({ data: data })
    }
    click = (e) => {
        if (e.target.classList.contains('hide-modal')) {
            this.props.removeComponent()
        }
    }
    handleFormData = event => {
        let value = event.target.value
        let name = event.target.name

        let newData = this.state.data;
        newData[name] = value

        if (name === 'payer') {
            if (value > 0) {
                this.getLesson(value)
            }
            else {
                this.setState({
                    lessons: []
                })
            }
        }

        this.setState({ data: newData })
    }
    getLesson = async value => {
        let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/student/lessons/${value}`)
        if (response.data.status === 'success') {
            console.log(response.data)
            this.setState({
                lessons: response.data.lessons
            })
        }
    }

    sendForm = async (event) => {
        event.preventDefault()

        let data = this.state.data
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
        let response = ""
        if (this.props.edit === 0) {
            response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/payments`, data)
        }
        else {
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/payments/${this.props.edit}`, data)
        }
        console.log(response.data)
        if (response.data.status === 'success') {
            NotificationManager.success(response.data.message, 'Success', 5000);
            this.props.load()
        }
        if (response.data.status === 'error') {
            let message = response.data.message;
            for (const [key, value] of Object.entries(message)) {
                NotificationManager.error(value, 'Error', 5000);
            }
        }

    }
    render() {
        return (
            <>
                <NotificationContainer />
                <div class="modal fade bd-example-modal-lg hide-modal" id="exampleModal" onClick={this.click} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg hide-modal" role="document">
                        <form onSubmit={this.sendForm}>
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">{(this.props.edit) ? 'Edit' : 'Add new'} payment details</h5>
                                    <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                        <span className="hide-modal" aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">


                                    <div class="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
                                                    Payer:
                                            </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control w-100" name="payer" onChange={this.handleFormData}>
                                                        <option value="">-- Student --</option>
                                                        {
                                                            this.state.payer.map((value, index) => {
                                                                if (this.props.data.payer === value.id) {
                                                                    return <option key={index} selected value={value.id}>{value.first_name} {value.last_name}</option>
                                                                }
                                                                else {
                                                                    return <option key={index} value={value.id}>{value.first_name} {value.last_name}</option>
                                                                }
                                                            })
                                                        }
                                                    </select>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label text-sm-center">
                                                    Lesson:
                                            </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control w-100" name="lesson" onChange={this.handleFormData}>
                                                        <option value="">-- Lesson --</option>
                                                        {
                                                            this.state.lessons.map((value, index) => {
                                                                if (this.props.data.lesson === value.lesson) {
                                                                    return <option key={index} selected value={value.lesson}>{value.lesson_name}</option>
                                                                }
                                                                else {
                                                                    return <option key={index} value={value.lesson}>{value.lesson_name}</option>
                                                                }
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
                                                    Adding date:
                                            </label>
                                                <div className="col-sm-8">
                                                    <input type="date" className="form-control" name="payment_date" value={this.props.data.payment_date} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label text-sm-center">
                                                    Payment value:
                                            </label>
                                                <div className="col-sm-8">
                                                    <input className="form-control" type="text" name="payment_value" value={this.props.data.payment_value} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row form-group ">
                                        <label className="col-sm-2 col-form-label">
                                            Comment:
                                    </label>
                                        <div className="col-sm-10">
                                            <textarea className="form-control" name="note" value={this.props.data.note} onChange={this.handleFormData}></textarea>
                                        </div>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <button type="reset" class="btn btn-default hide-modal" data-dismiss="modal">Close</button>
                                    <button type="submit" class="btn btn-success">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}
