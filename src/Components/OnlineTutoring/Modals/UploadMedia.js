import React, { Component } from 'react'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class UploadMedia extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }
    changeFile = event => {

        let newData = this.state.data;
        newData['file'] = event.target.files[0]
        this.setState({
            data: newData
        })
    }
    handleFormData = event => {
        let value = event.target.value
        let name = event.target.name

        let newData = this.state.data;
        newData[name] = value

        this.setState({
            data: newData
        })
    }
    click = (e) => {
        if (e.target.classList.contains('hide-modal')) {
            this.props.removeComponent()
        }
    }
    componentDidMount = () => {
        this.setState({data: this.props.data})
    }
    sendForm = async (event) => {
        event.preventDefault()

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
        let formData = new FormData();
        let data = this.state.data;
        
        formData.append('type', this.props.type)
        if (this.state.data.file)
            formData.append("file", this.state.data.file)
        if (this.state.data.title)
            formData.append("title", this.state.data.title)
        if (this.state.data.note)
            formData.append("note", this.state.data.note)

        let response = ""
        if (this.props.edit === 0) {
            response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/media`, formData)
        }
        else {
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/media/${this.props.edit}`, data)
        }
        if (response.data.status === 'success') {
            NotificationManager.success('Media əlavə edildi.', 'Success', 5000);
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
                <div className="modal fade bd-example-modal-lg hide-modal" id="uploadMediaModal" onClick={this.click} tabindex="-1" role="dialog" aria-labelledby="uploadMediaModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg hide-modal" role="document">
                        <form onSubmit={this.sendForm}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="uploadMediaModalLabel">{(this.props.edit) ? 'Edit' : 'Upload'} {this.props.type}</h5>
                                    <button type="button" className="close hide-modal" data-dismiss="modal" aria-label="Close">
                                        <span className="hide-modal" aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className={`row form-group ${this.props.edit > 0 && 'd-none'}`}>
                                        <div className="col-12">
                                            <input type="file" className="btn btn-default border-0 col-12" name="file" onChange={this.changeFile} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row form-group ">
                                                <label className="col-sm-3 col-form-label">
                                                    Title *:
                                            </label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control" name="title" value={this.props.data.title} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row form-group ">
                                                <label className="col-sm-3 col-form-label">
                                                    Description:
                                            </label>
                                                <div className="col-sm-9">
                                                    <textarea className="form-control" name="note" value={this.props.data.note} onChange={this.handleFormData}></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="reset" className="btn btn-default hide-modal" data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-success">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}
