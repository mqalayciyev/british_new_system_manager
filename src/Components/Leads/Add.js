import React, { Component } from 'react'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
export default class Add extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            owner: []
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
        let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/owner`)
        if (response.data.status === 'success') {
            this.setState({
                owner: response.data.owner
            })
        }
        
        let data = this.props.data
        console.log(data)
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

        this.setState({ data: newData })
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
            response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/tasks`, data)
        }
        else {
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/tasks/${this.props.edit}`, data)
        }
        console.log(response.data)
        if (response.data.status === 'success') {
            NotificationManager.success('Tapsiriq əlavə edildi.', 'Success', 5000);
            this.props.load()
        }
        if (response.data.status === 'error') {
            let message = response.data.message;
            for (const [key, value] of Object.entries(message)) {
                NotificationManager.error(value, 'Error', 5000);
            }
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
            response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/leads`, data)
        }
        else {
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/leads/${this.props.edit}`, data)
        }
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
                                    <h5 class="modal-title" id="exampleModalLabel">{(this.props.edit) ? 'Edit' : 'Add'} leads</h5>
                                    <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                        <span className="hide-modal" aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">

                                    <div class="form-group row">
                                        <div className="col-sm-6">
                                            <div className="row">
                                                <label className="col-4 col-sm-6 col-form-label">
                                                    First Name:
                                            </label>
                                                <div className="col-8 col-sm-6">
                                                    <input type="text" className="form-control" name="first_name" value={this.props.data.first_name} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6 mt-3 mt-sm-0">
                                            <div className="row">
                                                <label className="col-4 col-sm-6 col-form-label text-sm-center">
                                                    Last Name:
                                            </label>
                                                <div className="col-8 col-sm-6">
                                                    <input type="text" className="form-control" name="last_name" value={this.props.data.last_name} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="row">
                                                        <label className="col-4 col-sm-6 col-form-label">
                                                            Lead Owner:
                                                    </label>
                                                        <div className="col-8 col-sm-6">
                                                            <select className="form-control" name="assignee" onChange={this.handleFormData}>
                                                                <option>-- Owner --</option>
                                                                {this.state.owner.map((value, index) => {
                                                                    if (this.props.data.assignee === value.id) {
                                                                        return <option key={index} selected value={value.id}>{value.first_name} {value.last_name}</option>
                                                                    }
                                                                    else {
                                                                        return <option key={index} value={value.id}>{value.first_name} {value.last_name}</option>
                                                                    }
                                                                })}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div className="col-12">
                                            <div className="row">
                                                <label className="col-3  col-form-label">
                                                    Lead Purpose:
                                                        </label>
                                                <div className="col-9 ">
                                                    <input type="text" className="form-control" name="purpose" onChange={this.handleFormData} value={this.props.data.purpose} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="row">
                                                        <label className="col-4 col-sm-6 col-form-label">
                                                            Mobile:
                                                    </label>
                                                        <div className="col-8 col-sm-6">
                                                            <input type="tel" className="form-control" name="mobile" value={this.props.data.mobile} onChange={this.handleFormData} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="row">
                                                        <label className="col-4 col-sm-6 col-form-label text-sm-center">
                                                            Phone:
                                                    </label>
                                                        <div className="col-8 col-sm-6">
                                                            <input type="tel" className="form-control" name="phone" value={this.props.data.phone} onChange={this.handleFormData} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="row">
                                                        <label className="col-4 col-sm-6 col-form-label">
                                                            Email:
                                                    </label>
                                                        <div className="col-8 col-sm-6">
                                                            <input type="email" className="form-control" name="email" value={this.props.data.email} onChange={this.handleFormData} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="row">
                                                        <label className="col-4 col-sm-6 col-form-label text-sm-center">
                                                            Address:
                                                    </label>
                                                        <div className="col-8 col-sm-6">
                                                            <input type="text" className="form-control" name="address" value={this.props.data.address} onChange={this.handleFormData} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row form-group">
                                        <div className="col-sm-6">
                                            <div className="row">
                                                <label className="col-4 col-sm-6 col-form-label">
                                                    Leads source:
                                                    </label>
                                                <div className="col-8 col-sm-6">
                                                    <select className="form-control" name="source" value={this.props.data.source} onChange={this.handleFormData}>
                                                        <option>-- Leads source --</option>
                                                        <option value="Call">Call</option>
                                                        <option value="Letter">Letter</option>
                                                        <option value="Personal">Personal</option>
                                                        <option value="Website">Website</option>
                                                        <option value="Social network">Social network</option>
                                                        <option value="Leaflet">Leaflet</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group row" style={this.props.edit > 0 ? { display: 'none' } : null}>
                                        <div className="col-12">
                                            <div className="row">
                                                <label className="col-4 col-sm-3 col-form-label">
                                                    Note:
                                                </label>
                                                <div className="col-8 col-sm-9">
                                                    <textarea className="form-control" name="description" onChange={this.handleFormData}></textarea>
                                                </div>
                                            </div>
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
