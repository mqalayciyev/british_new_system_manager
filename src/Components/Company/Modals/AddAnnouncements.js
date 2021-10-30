import React, { Component } from 'react'
import Select from 'react-select';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class AddAnnouncements extends Component {

    constructor(props){
        super(props)
        this.state = {
            selectedOptions: [],
            options: [{value: 1, label: 'Everyone'}, {value: 2, label: 'Manager'}, {value: '3', label: 'Teacher'}, {value: '4', label: 'Student'}],
        }
    }
    changeHandle = selectedOption => {
        let filters = selectedOption.filter(function (items) {
            if(items.value == 1){
                return [{value: 1, label: 'Everyone'}]
            }
        });
        filters = (filters.length === 0 ) ? selectedOption : filters;
        let newData = this.state.data;
        newData['share_with'] = filters
        this.setState({data: newData, selectedOptions: filters})
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
        let data = this.props.data
        this.setState({ data: data, selectedOptions: data.share_with})
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
            response= await axios.post(`${process.env.REACT_APP_API_URL}/managers/announcements`, data)
        }
        else{
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/announcements/${this.props.edit}`, data)
        }
        console.log(response.data)
        if(response.data.status === 'success'){
            NotificationManager.success(response.data.message, 'Success', 5000);
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
                            <h5 class="modal-title" id="exampleModalLabel">{(this.props.edit) ? 'Edit' : 'Add'} announcements</h5>
                            <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                <span className="hide-modal" aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            
                                <div className="form-group row">
                                    <div className="col-12">
                                        <div className="row">
                                            <label className="col-4 col-form-label">
                                                Share with:
                                                    </label>
                                            <div className="col-8">
                                                <Select
                                                    isMulti
                                                    name="share_with"
                                                    value={this.state.selectedOptions}
                                                    options={this.state.options}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    onChange={this.changeHandle}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div className="col-12">
                                        <textarea className="form-control" name="note" value={this.props.data.note} onChange={this.handleFormData}></textarea>
                                    </div>
                                </div>
                            
                        </div>
                        <div class="modal-footer">
                            <button type="reset" class="btn btn-default hide-modal" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-success">Send</button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
            </>
        )
    }
}
