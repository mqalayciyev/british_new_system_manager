import React, { Component } from 'react'
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class AddAdministrativeStaff extends Component {
    constructor(props){
        super(props)
        this.state = {
            roles: ['', 'Administrator', '', '', 'Coordinator'],
            status: ['Resigned', 'Works', 'Intern', 'On Holiday'],
            offices: []
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
        

        let offices_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/offices`)
        if (offices_res.data.status === 'success') {
            this.setState({
                offices: offices_res.data.offices
            })
        }

        let data = this.props.data
        this.setState({ data: data})
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
        if(this.props.edit === 0){
            response= await axios.post(`${process.env.REACT_APP_API_URL}/managers/manager`, data)
        }
        else{
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/manager/${this.props.edit}`, data)
        }

        console.log(response.data)

        if(response.data.status === 'success'){
            NotificationManager.success('Administrative Staff əlavə edildi.', 'Success', 5000);
            this.props.load()
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
            <NotificationContainer />
            <div class="modal fade bd-example-modal-lg hide-modal" id="exampleModal" onClick={this.click} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg hide-modal" role="document">
                    <form onSubmit={this.sendForm}>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel"> {(this.props.edit) ? 'Edit' : 'Add'} adminitrative staff</h5>
                            <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                <span className="hide-modal" aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            
                                <div class="form-group row">
                                    <div className="col-6">
                                        <select className="form-control w-100" name="type" onChange={this.handleFormData}>
                                        <option value="">--Type--</option>
                                            {
                                                this.state.roles.map((value, index)=>{
                                                    if(index !== 0 && index !== 2 && index !== 3){
                                                        if(this.props.data.type === index){
                                                            return <option key={index} selected value={index}>{value}</option>
                                                        }
                                                        else{
                                                            return <option key={index} value={index}>{value}</option>
                                                        }
                                                    }
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <select className="form-control w-100" name="status" onChange={this.handleFormData}>
                                        <option value="">--Status--</option>
                                            {
                                                this.state.status.map((value, index)=>{
                                                    if(this.props.data.status === index){
                                                        return <option key={index} selected value={index}>{value}</option>
                                                    }
                                                    else{
                                                        return <option key={index} value={index}>{value}</option>
                                                    }
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>

                                <div class="row">
                                    <div className="col-12">
                                        <fieldset className="form-group border p-3">
                                            <legend className="w-auto px-2">Information for authorization</legend>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="row">
                                                        <label className="col-4 col-sm-6 col-form-label">
                                                            Email
                                                        </label>
                                                        <div className="col-8 col-sm-6">
                                                            <input type="email" className="form-control" name="email" value={this.props.data.email} onChange={this.handleFormData} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                <div className="row">
                                                        <label className="col-4 col-sm-6 col-form-label text-sm-center">
                                                        Password
                                                        </label>
                                                        <div className="col-8 col-sm-6">
                                                            <input type="text" className="form-control" name="password" value={this.props.data.password} onChange={this.handleFormData} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <input type="text" placeholder="First name" className="form-control" name="first_name" value={this.props.data.first_name} onChange={this.handleFormData} />
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" placeholder="Last name" className="form-control" name="last_name" value={this.props.data.last_name} onChange={this.handleFormData} />
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" placeholder="Address" className="form-control" name="address" value={this.props.data.address} onChange={this.handleFormData} />
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
                                                    Main office:
                                                    </label>
                                                    <div className="col-8 col-sm-6">
                                                        <select className="form-control" name="office"  onChange={this.handleFormData}>
                                                        <option  selected value="">--Office--</option>
                                                        {
                                                            this.state.offices.map((value, index)=>{
                                                                if(this.props.data.office_id === value.id){
                                                                    return <option key={index} selected value={value.id}>{value.name}</option>
                                                                }
                                                                else{
                                                                    return <option key={index} value={value.id}>{value.name}</option>
                                                                }
                                                            })
                                                        }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="row">
                                                    <label className="col-4 col-sm-6 col-form-label text-sm-center">
                                                    Mobile:
                                                    </label>
                                                    <div className="col-8 col-sm-6">
                                                        <input type="tel" className="form-control" name="mobile" value={this.props.data.mobile} onChange={this.handleFormData} />
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
