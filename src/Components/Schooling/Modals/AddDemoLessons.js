import React, { Component } from 'react'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class AddDemoLessons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            students: [],
            lessons: [],
            offices: [],
            teacher: [],
        };
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
        
        let students_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/students`)
        if (students_res.data.status === 'success') {
            // console.log(students_res.data)
            this.setState({
                students: students_res.data.students
            })
        }


        let teacher_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/teacher`)
        if (teacher_res.data.status === 'success') {
            // console.log(teacher_res.data)
            this.setState({
                teacher: teacher_res.data.teachers
            })
        }

        let office_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/offices`)
        if (office_res.data.status === 'success') {
            // console.log(office_res.data)
            this.setState({
                offices: office_res.data.offices
            })
        }
        let lesson_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/lesson`)
        if (lesson_res.data.status === 'success') {
            // console.log(lesson_res.data)

            this.setState({
                lessons: lesson_res.data.lesson
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
            response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/demo`, data)
        }
        else {
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/demo/${this.props.edit}`, data)
        }
        console.log(response.data)

        if (response.data.status === 'success') {
            NotificationManager.success('Demo ders əlavə edildi.', 'Success', 5000);
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
            <div class="modal fade bd-example-modal-lg hide-modal" id="exampleModal" data-edit={this.props.edit} onClick={this.click} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg hide-modal" role="document">
                    <form onSubmit={this.sendForm}>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">{(this.props.edit) ? 'Edit' : 'Add new '} demo lesson</h5>
                                <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                    <span className="hide-modal" aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
                                                    Office:
                                            </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="office" onChange={this.handleFormData}>
                                                        <option>-- Office --</option>
                                                        {
                                                            this.state.offices.map((value, index) => {
                                                                if (this.props.data.office === value.id) {
                                                                    return <option key={index} value={value.id} selected>{value.name}</option>
                                                                }
                                                                else {
                                                                    return <option key={index} value={value.id}>{value.name}</option>
                                                                }
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
                                                    Teachers:

                                            </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="teacher" onChange={this.handleFormData}>
                                                        <option value="">-- Teachers --</option>
                                                        {
                                                            this.state.teacher.map((value, index) => {
                                                                if (this.props.data.teacher === value.id) {
                                                                    return <option key={index} value={value.id} selected>{value.first_name} {value.last_name}</option>
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
                                    </div>
                                    <div class="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
                                                    Lesson:
                                            </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="lesson" onChange={this.handleFormData}>
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
                                                <label className="col-sm-4 col-form-label">
                                                    Date:
                                            </label>
                                                <div className="col-sm-8">
                                                    <input type="datetime-local" className="form-control" name="date" value={this.props.data.date} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
                                                    Student:
                                            </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="student" onChange={this.handleFormData}>
                                                        <option>-- Student --</option>
                                                        {
                                                            this.state.students.map((value, index) => {
                                                                if (this.props.data.student === value.id) {
                                                                    return <option key={index} value={value.id} selected>{value.user_name}</option>
                                                                }
                                                                else {
                                                                    return <option key={index} value={value.id}>{value.user_name}</option>
                                                                }
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
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
