import React, { Component } from 'react'

import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
export default class AddDemoLessons extends Component {

    constructor(props) {
        super(props)
        this.state = {
            numChildren: 0,
            children: [],
            lessons: [],
            levels: [],
            data: {}
        }
    }
    handleFormData = async event => {
        let value = event.target.value
        let name = event.target.name

        let newData = this.state.data;
        newData[name] = value

        this.setState({
            data: newData
        })

    }
    changeLevel = selectedOption => {

        let newData = this.state.data;
        newData['selectedLevel'] = selectedOption

        this.setState({
            data: newData,
            selectedLevel: selectedOption
        })
    };
    click = (e) => {
        if (e.target.classList.contains('hide-modal')) {
            this.props.removeComponent()
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
        this.setState({ data: this.props.data })
        let lesson_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/lesson`)
        if (lesson_res.data.status === 'success') {
            this.setState({
                lessons: lesson_res.data.lesson
            })
        }
        let level_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/level`)
        if (level_res.data.status === 'success') {
            this.setState({
                levels: level_res.data.level
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
            response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/tests`, data)
        }
        else {
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/tests/${this.props.edit}`, data)
        }
        // console.log(response.data)

        if (response.data.status === 'success') {
            NotificationManager.success('Test əlavə edildi.', 'Success', 5000);
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
                <div class="modal fade bd-example-modal-lg hide-modal" id="uploadTestModal" data-edit={this.props.edit} onClick={this.click} tabindex="-1" role="dialog" aria-labelledby="uploadTestModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg hide-modal" role="document">
                        <form onSubmit={this.sendForm}>
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="uploadTestModalLabel">{(this.props.edit) ? 'Edit' : 'Upload'} test</h5>
                                    <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                        <span className="hide-modal" aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">

                                    <div class="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
                                                    Name *:
                                            </label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" name="name" value={this.props.data.name} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label text-sm-center">
                                                    Level:
                                            </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="level" onChange={this.handleFormData}>
                                                        <option value="">-- Level --</option>
                                                        {
                                                            this.state.levels.map((value, index) => {
                                                                if (this.props.data.level === value.id) {
                                                                    return <option key={index} value={value.id} selected>{value.title}</option>
                                                                }
                                                                else {
                                                                    return <option key={index} value={value.id}>{value.title}</option>
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
                                                    Lesson:
                                            </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="lesson" value={this.props.data.lesson} onChange={this.handleFormData}>
                                                        <option value="">-- Lesson --</option>
                                                        {
                                                            this.state.lessons.map((value, index) => {
                                                                if (this.props.data.lesson === value.id) {
                                                                    return <option key={index} value={value.id} selected>{value.title}</option>
                                                                }
                                                                else {
                                                                    return <option key={index} value={value.id}>{value.title}</option>
                                                                }
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label text-center">
                                                    Status:
                                            </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="status" value={this.props.data.status} onChange={this.handleFormData}>
                                                        <option value="0">Passiv</option>
                                                        <option value="1">Aktiv</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
                                                    For Exam:
                                                </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="for_exam" value={this.props.data.for_exam} onChange={this.handleFormData}>
                                                        <option value="0">No</option>
                                                        <option value="1">Yes</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
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
                                    {/* <div class="form-group row">
                                        <div className="col-6 offset-6">
                                            <a href="javascript-void:0" onClick={this.addChild}>Add question</a>
                                        </div>
                                    </div>

                                    <div id="AddQuestion">
                                        {this.state.children}
                                    </div> */}

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
