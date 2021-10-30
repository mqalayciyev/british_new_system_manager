import React, { Component } from 'react'
import UploadTest from './Modals/UploadTest'
import Questions from './Modals/Questions';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class GroupLessons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tests: [],
            data: {},
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/tests`)
        if (response.data.status === 'success') {
            // console.log(response.data)
            this.setState({
                tests: response.data.tests,
                delete: userInfo.user.user_info.type === 1 ? true : false,
                display: false
            })
        }


    }
    removeComponent = () => {
        this.setState({
            modal: []
        })
    }
    addComponent = (value) => {
        let edit = 0
        let data = {}
        if (value) {
            edit = value.id
            data = value
        }

        let modal = <UploadTest edit={edit} data={data} removeComponent={this.removeComponent} load={this.load} />

        this.setState({
            modal: modal
        })
    }
    questionsComponent = (value) => {

        let modal = <Questions id={value} removeComponent={this.removeComponent} load={this.load} />

        this.setState({
            modal: modal
        })
    }
    capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    delete = async id => {
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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/tests/${id}`)


        if (response.data.status === 'success') {
            NotificationManager.warning(response.data.message, 'Warning', 5000);
            this.load()
        }
    }
    render() {
        return (
            <>
            <NotificationContainer />
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 col-sm-6">
                                <h4>Tests</h4>
                            </div>
                            <div className="col-12 col-sm-6 clearfix">
                                <button type="button" class="btn btn-info  float-right" data-toggle="modal" data-target="#uploadTestModal" onClick={() => this.addComponent()} >Add</button>
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
                                                <th scope="col">Name</th>
                                                <th scope="col">Lesson</th>
                                                <th scope="col">Level</th>
                                                <th scope="col">For Exam</th>
                                                <th scope="col">Added by</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Questions</th>
                                                <th scope="col">Status</th>
                                                <th scope="col"></th>
                                                {/* <th scope="col"><button className="btn Btn32 text-danger"><i class="fas fa-trash"></i></button></th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.tests.length > 0 ? this.state.tests.map((value, index) => {
                                            const questions_count = JSON.parse(value.questions_count)
                                            const count = questions_count.filter(questions => questions.id !== null).length
                                                return (
                                                    <tr key={index}>

                                                        <td>
                                                            {value.name}
                                                        </td>

                                                        <td>
                                                            {value.lesson_title}
                                                        </td>
                                                        <td>
                                                            {value.level_title}
                                                        </td>
                                                        <td>
                                                            {value.for_exam ? 'Yes' : 'No'}
                                                        </td>
                                                        <td>
                                                            {value.user_name}
                                                        </td>
                                                        <td>
                                                            {value.note}
                                                        </td>
                                                        <td>
                                                            {count}
                                                        </td>
                                                        <td>
                                                            {value.status}
                                                        </td>
                                                        <td className="btnTD text-center">
                                                            <button className="btn Btn32 btn-warning mx-1" data-toggle="modal" data-target="#uploadTestModal" onClick={() => this.addComponent(value)}><i class="fas fa-pencil-alt"></i></button>
                                                            {/* <button className="btn Btn32 btn-info"><i class="far fa-eye"></i></button> */}
                                                            <button className="btn Btn32 btn-success" data-toggle="modal" data-target="#questionsModal" onClick={() => this.questionsComponent(value.id)}><i class="fas fa-clipboard"></i></button>
                                                            {
                                                                this.state.delete ? <button className="btn Btn32 btn-danger" onClick={() => this.delete(value.id)}><i class="fas fa-trash"></i></button> : ''
                                                            }
                                                        </td>
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
                {
                    this.state.modal
                }
            </>
        )
    }
}
