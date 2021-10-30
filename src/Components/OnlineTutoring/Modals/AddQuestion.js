import React, { Component } from 'react'

import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class AddQuestion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }
    handleFormData = async event => {
        let value = event.target.value
        let name = event.target.name

        let newData = this.state.data;
        newData[name] = value
        newData['test'] = this.props.test_id

        this.setState({
            data: newData
        })

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
        data['test'] = this.props.test_id
        this.setState({ data: data })
    }
    click = (e) => {
        if (e.target.classList.contains('hide-modal')) {
            this.props.removeComponent()
        }
    }
    sendForm = async (event) => {
        event.preventDefault()

        let data = this.state.data
        console.log(data)
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
            response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/questions`, data)
        }
        else {
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/questions/${this.props.edit}`, data)
        }
        console.log(response.data)

        if (response.data.status === 'success') {
            NotificationManager.success('Sual əlavə edildi.', 'Success', 5000);
            document.getElementById('addQuestionModal').click()
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
            <div class="addQuestion modal fade hide-modal" id="addQuestionModal" style={{zIndex: 1500, position: 'fixed', top: '0px', left: '0px', width: '100%', height: '100%'}} onClick={this.click} >
                <div class="modal-dialog hide-modal" style={{zIndex: 1500}} role="document">
                    <form onSubmit={this.sendForm}>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="addQuestionModalLabel">Add Question</h5>
                                <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                    <span className="hide-modal" aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div className="row">
                                    <div className="col-12">
                                        <div class="form-group row">
                                            <div className="col-12">
                                                <div className="row">
                                                    <label className="col-4 col-sm-3 col-form-label">
                                                        Question:
                                                    </label>
                                                    <div className="col-8 col-sm-9">
                                                        <textarea className="form-control" name="question" value={this.props.data.question} onChange={this.handleFormData}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div className="col-12 bg-success p-3">
                                                <div className="row">
                                                    <label className="col-4 col-sm-3 col-form-label">
                                                        Correct Answer:
                                                    </label>
                                                    <div className="col-8 col-sm-7">
                                                        <textarea className="form-control" name="answer_true" value={this.props.data.answer_true} onChange={this.handleFormData}></textarea>
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
                                                                Answer 1:
                                                            </label>
                                                            <div className="col-8 col-sm-6">
                                                                <textarea className="form-control" name="answer_1" value={this.props.data.answer_1} onChange={this.handleFormData}></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="row">
                                                            <label className="col-4 col-sm-6 col-form-label text-sm-center">
                                                                Answer 2:
                                                            </label>
                                                            <div className="col-8 col-sm-6">
                                                                <textarea className="form-control" name="answer_2" value={this.props.data.answer_2} onChange={this.handleFormData}></textarea>
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
                                                                Answer 3:
                                                            </label>
                                                            <div className="col-8 col-sm-6">
                                                                <textarea className="form-control" name="answer_3" value={this.props.data.answer_3} onChange={this.handleFormData}></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="row">
                                                            <label className="col-4 col-sm-6 col-form-label text-sm-center">
                                                                Answer 4:
                                                            </label>
                                                            <div className="col-8 col-sm-6">
                                                                <textarea className="form-control" name="answer_4" value={this.props.data.answer_4} onChange={this.handleFormData}></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="reset" class="btn btn-secondary hide-modal" data-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary">Add</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            </>
        )
    }
}
