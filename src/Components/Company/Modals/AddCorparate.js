import React, { Component } from 'react'
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class AddCorparate extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: []
        }
    }
      
    handleFormData = event => {
        let value = event.target.value
        let name = event.target.name
        this.props.setData(name, value)
    }
    componentDidMount = async () => {
        let data = this.props.data
        this.setState({ data: data})
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
        if(this.props.edit === 0){
            response= await axios.post(`${process.env.REACT_APP_API_URL}/managers/clients`, data)
        }
        else{
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/clients/${this.props.edit}`, data)
        }

        if(response.data.status === 'success'){
            NotificationManager.success('Corparative musteri əlavə edildi.', 'Success', 5000);
            this.props.load()
        }
        if(response.data.status === 'error'){
            let message = response.data.message;
            for (const value of Object.values(message)) {
                NotificationManager.error(value, 'Error', 5000);
            }
        }

    }
    click = (e) => {
        if (e.target.classList.contains('hide-modal')) {
            this.props.removeComponent()
        }
    }
      
    render() {
        return (
            <>
            <NotificationContainer/>
            <div class="modal fade bd-example-modal-lg hide-modal" id="exampleModal" onClick={this.click}  tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg hide-modal" role="document">
                <form onSubmit={this.sendForm}>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">{(this.props.edit) ? 'Edit' : 'Add'} corparate clienst</h5>
                            <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" className="hide-modal">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            
                                <div class="form-group row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-sm-6">
                                                <div className="row">
                                                    <label className="col-4 col-sm-6 col-form-label">
                                                        Name *:
                                                </label>
                                                    <div className="col-8 col-sm-6">
                                                        <input type="tel" className="form-control" name="name" value={this.props.data.name} onChange={this.handleFormData} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="row">
                                                    <label className="col-4 col-sm-6 col-form-label text-sm-center">
                                                        Address:
                                                </label>
                                                    <div className="col-8 col-sm-6">
                                                        <input type="tel" className="form-control" name="address" value={this.props.data.address} onChange={this.handleFormData} />
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
                                                        Website:
                                                </label>
                                                    <div className="col-8 col-sm-6">
                                                        <input type="url" placeholder="http://" className="form-control" name="website" value={this.props.data.website} onChange={this.handleFormData} />
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
                                                        Status:
                                                </label>
                                                    <div className="col-8 col-sm-6">
                                                        <select className="form-control" name="status" value={this.props.data.status} onChange={this.handleFormData}>
                                                            <option value="0">Passiv</option>
                                                            <option value="1">Aktiv</option>
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
                                            <label className="col-4 col-sm-3 col-form-label">
                                                Note:
                                            </label>
                                            <div className="col-8 col-sm-9">
                                            <textarea className="form-control" name="note" value={this.props.data.note} onChange={this.handleFormData}></textarea>
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
