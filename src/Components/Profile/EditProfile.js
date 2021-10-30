import React, { Component } from 'react';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SessionContext } from "../../Context/Session";

export default class EditProfile extends Component {
    static contextType = SessionContext;
    constructor (props){
        super(props)
        this.state = {
            genders: [
                {value: '', name: '-- Select --'},
                {value: 'male', name: 'Male'},
                {value: 'female', name: 'Female'},
            ],
            formData: {first_name: this.props.user.first_name,
                        last_name: this.props.user.last_name,
                        email: this.props.user.email,
                        date: this.props.user.date,
                        mobile: this.props.user.mobile,
                        phone: this.props.user.phone,
                        gender: this.props.user.gender,
                        note: this.props.user.note
                    }
            
        }
        
    }
    handleSetState = event => {
        let value = event.target.value
        let name = event.target.name
        let newFormData = this.state.formData;
        newFormData[name] = value
        this.setState({
            formData: newFormData
        })
    }
    formSend = async (event) => {
        event.preventDefault();
        
        var data = this.state.formData

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

        let response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/manager/${this.props.user.id}`, data)
        if(response.data.status === 'success'){
            NotificationManager.success('Məlumatlar dəyişdirildi.', 'Success', 5000);
            userInfo['user']['user_info'] = response.data.user;
            localStorage.setItem('user-info', JSON.stringify(userInfo))
            this.context.setSession(response.data.status, userInfo)
        }
        if(response.data.status === 'error'){
            let message = response.data.message;
            for (const [key, value] of Object.entries(message)) {
                NotificationManager.error(value, 'Error', 5000);
            }
        }
    }
    render() {
        return (
            <>
            <NotificationContainer/>
            <div class="modal fade bd-example-modal-lg" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <form onSubmit={this.formSend}>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="editModalLabel">Edit</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="row form-group">
                                            <label className="col-3 col-form-label">First Name</label>
                                            <div className="col-9">
                                                <input className="form-control" name="first_name" type="text" onChange={this.handleSetState} required value={this.state.formData.first_name} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row form-group">
                                            <label className="col-3 col-form-label">Last Name</label>
                                            <div className="col-9">
                                                <input className="form-control" name="last_name" type="text" onChange={this.handleSetState} required value={this.state.formData.last_name}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="row form-group">
                                            <label className="col-3 col-form-label">Email</label>
                                            <div className="col-9">
                                                <input className="form-control" name="email" type="email" onChange={this.handleSetState} required value={this.state.formData.email}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row form-group">
                                            <label className="col-3 col-form-label">Gender</label>
                                            <div className="col-9">
                                            
                                                <select name="gender" onChange={this.handleSetState} className="form-control">
                                                    {
                                                        this.state.genders.map((gender, key) => {
                                                            if(this.state.formData.gender === gender.value){
                                                                return <option key={key}  selected value={gender.value}>{gender.name}</option>
                                                            }
                                                            else{
                                                                return <option key={key} value={gender.value}>{gender.name}</option>
                                                            }
                                                            
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="row form-group">
                                            <label className="col-3 col-form-label">Mobile</label>
                                            <div className="col-9">
                                                <input className="form-control" name="mobile" type="text" onChange={this.handleSetState} required value={this.state.formData.mobile} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row form-group">
                                            <label className="col-3 col-form-label">Phone</label>
                                            <div className="col-9">
                                                <input className="form-control" name="phone" type="text" onChange={this.handleSetState} value={this.state.formData.phone}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="row form-group">
                                            <label className="col-3 col-form-label">Date</label>
                                            <div className="col-9">
                                                <input className="form-control" name="date" type="date" onChange={this.handleSetState} required value={this.state.formData.date} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row form-group">
                                            <label className="col-4 col-sm-2 col-form-label">Comment</label>
                                            <div className="col-8 col-sm-10">
                                                <textarea className="form-control" name="note" cols="20" rows="5" onChange={this.handleSetState} >{this.state.formData.note}</textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="reset" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            </>
        )
    }
}
