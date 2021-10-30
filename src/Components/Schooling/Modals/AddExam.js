import React, { Component } from 'react'
import axios from 'axios';
import Select from 'react-select';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class AddExam extends Component {
    constructor(props) {
        super(props)
        this.state = {
            students: [],
            levels: [],
            offices: [],
            teacher: [],
            tests: [],
            exam_type: [],
            selectedLevel: []
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

        if (this.props.edit > 0) {


            let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/exam/levels/${this.props.edit}`)
            if (response.data.status === 'success') {
                let array = []
                if (response.data.levels.length > 0) {
                    response.data.levels.forEach(element => {
                        array.push({ value: element.level, label: element.level_title })
                    });
                }
                this.changeLevel(array)
            }
        }

        // let students_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/students`)
        // if (students_res.data.status === 'success') {
        //     // console.log(students_res.data)
        //     this.setState({
        //         students: students_res.data.students
        //     })
        // }


        // let teacher_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/teacher`)
        // if (teacher_res.data.status === 'success') {
        //     // console.log(teacher_res.data)
        //     this.setState({
        //         teacher: teacher_res.data.teachers
        //     })
        // }

        let office_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/offices`)
        if (office_res.data.status === 'success') {
            // console.log(office_res.data)
            this.setState({
                offices: office_res.data.offices
            })
        }

        let type_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/exam_type`)
        if (type_res.data.status === 'success') {
            // console.log(lesson_res.data)

            this.setState({
                exam_type: type_res.data.exam_type
            })
        }
        let test_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/exam_tests`)
        // console.log(test_res)
        if (test_res.data.status === 'success') {
            console.log(test_res.data)

            this.setState({
                tests: test_res.data.tests
            })
        }
        let level_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/level`)
        if (level_res.data.status === 'success') {
            let array = []
            if (level_res.data.level.length > 0) {
                level_res.data.level.forEach(element => {
                    array.push({ value: element.id, label: element.title })
                });
            }
            this.setState({
                levels: array
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
            response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/exam`, data)
        }
        else {
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/exam/${this.props.edit}`, data)
        }
        console.log(response.data)

        if (response.data.status === 'success') {
            NotificationManager.success('Imtahan əlavə edildi.', 'Success', 5000);
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
                                    <h5 class="modal-title" id="exampleModalLabel">{(this.props.edit) ? 'Edit' : 'Add new '} exam</h5>
                                    <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                        <span className="hide-modal" aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
                                                    Name:
                                                </label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" name="name" value={this.props.data.name} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label ">
                                                    Office:
                                                </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="office" onChange={this.handleFormData}>
                                                        <option value="">-- Office --</option>
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
                                    </div>
                                    <div class="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
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
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label ">
                                                    Test:
                                                </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="test" onChange={this.handleFormData}>
                                                        <option value="">-- Test --</option>
                                                        {
                                                            this.state.tests.map((value, index) => {
                                                                if (this.props.data.test === value.id) {
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
                                    </div>
                                    <div class="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
                                                    Type:
                                                </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="type" onChange={this.handleFormData}>
                                                        <option value="">-- Type --</option>
                                                        {
                                                            this.state.exam_type.map((value, index) => {
                                                                if (this.props.data.type === value.id) {
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
                                                <label className="col-sm-4 col-form-label ">
                                                    Level:
                                                </label>
                                                <div className="col-sm-8">
                                                    <Select
                                                        value={this.state.selectedLevel}
                                                        isMulti
                                                        name="lessons"
                                                        options={this.state.levels}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        onChange={this.changeLevel}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
									<div class="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label ">
                                                    Time:
                                                </label>
                                                <div className="col-sm-8">
													<input type="text" placeholder="Minutes" className="form-control" name="time" value={this.props.data.time} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row form-group ">
                                        <label className="col-sm-3 col-form-label">
                                            Note:
                                        </label>
                                        <div className="col-sm-9">
                                            <textarea className="form-control" name="note" value={this.props.data.note} onChange={this.handleFormData}>
                                            </textarea>
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
