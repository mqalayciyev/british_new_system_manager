import React, { Component } from 'react'
import Select from 'react-select';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class AddPrivateLessons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            weekday: [
                { value: 'monday', label: 'Monday' },
                { value: 'tuesday', label: 'Tuesday' },
                { value: 'wednesday', label: 'Wednesday' },
                { value: 'thursday', label: 'Thursday' },
                { value: 'friday', label: 'Friday' },
                { value: 'saturday', label: 'Saturday' },
                { value: 'sunday', label: 'Sunday' }
            ],
            students: [],
            lessons: [],
            price: [],
            teacher: [],
            selectedStudyDays: [],
            status: ['Resigned', 'Works', 'Intern', 'On Holiday']
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
        if (name === 'student') {
            if(value > 0){
                this.getLesson(value)
            }
            else{
                this.setState({
                    lessons: []
                })
            }
        }

    }
    getLesson = async value => {
        let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/student/lessons/${value}`)
        if (response.data.status === 'success') {
            console.log(response.data)
            this.setState({
                lessons: response.data.lessons
            })
        }
    }
    changeStudyDays = selectedOption => {

        let newData = this.state.data;
        newData['selectedStudyDays'] = selectedOption

        this.setState({
            data: newData,
            selectedStudyDays: selectedOption
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
        const capitalize = (s) => {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        }

        if (this.props.edit > 0) {

            this.getLesson(this.props.data.student)


            let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/private/study_days/${this.props.edit}`)
            // console.log(response.data)
            if (response.data.status === 'success') {
                let array = []
                for (const [keys, value] of Object.entries(response.data.study_days)) {
                    if(keys !== 'id' && keys !== 'company' && keys !== 'created_at'  && keys !== 'deleted_at' && keys !== 'updated_at' && keys !== 'private' && value === 1){
                        array.push({ value: keys.toLowerCase(), label: capitalize(keys) })
                    }
                }
                this.changeStudyDays(array)
            }
        }
        let students_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/students`)
        if (students_res.data.status === 'success') {
            console.log(students_res.data)
            this.setState({
                students: students_res.data.students
            })
        }


        let price_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/academic_hour`)
        if (price_res.data.status === 'success') {
            this.setState({
                price: price_res.data.academic_hour
            })
        }
        let teacher_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/teacher`)
        if (teacher_res.data.status === 'success') {
            console.log(teacher_res.data)
            this.setState({
                teacher: teacher_res.data.teachers
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
            response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/private`, data)
        }
        else {
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/private/${this.props.edit}`, data)
        }
        console.log(response.data)

        if (response.data.status === 'success') {
            NotificationManager.success('Private ders əlavə edildi.', 'Success', 5000);
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
            <div className="modal fade bd-example-modal-lg hide-modal" id="exampleModal" data-edit={this.props.edit} onClick={this.click} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg hide-modal" role="document">
                    <form onSubmit={this.sendForm}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{(this.props.edit) ? 'Edit' : 'Add new'} private lesson</h5>
                                <button type="button" className="close hide-modal" data-dismiss="modal" aria-label="Close">
                                    <span className="hide-modal" aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
                                                    Student:
                                            </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="student" onChange={this.handleFormData}>
                                                        <option value="">-- Student --</option>
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
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
                                                    Status:
                                            </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="status" value={this.props.data.status} onChange={this.handleFormData}>
                                                        <option value="">-- Status --</option>
                                                        <option value="1">Actual</option>
                                                        <option value="2">Complete</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
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
                                                                if (this.props.data.lesson === value.lesson) {
                                                                    return <option key={index} value={value.lesson} selected>{value.lesson_name}</option>
                                                                }
                                                                else {
                                                                    return <option key={index} value={value.lesson}>{value.lesson_name}</option>
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
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label">
                                                    Default price:
                                            </label>
                                                <div className="col-sm-8">
                                                    <select className="form-control" name="price" onChange={this.handleFormData}>
                                                        <option value="">-- Price --</option>
                                                        {
                                                            this.state.price.map((value, index) => {
                                                                if (this.props.data.price === value.id) {
                                                                    return <option key={index} value={value.id} selected>{value.minutes}min - {value.price}</option>
                                                                }
                                                                else {
                                                                    return <option key={index} value={value.id}>{value.minutes}min - {value.price}</option>
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
                                                    Hours:
                                            </label>
                                                <div className="col-sm-8">
                                                    <input type="number" min="0" className="form-control" name="hours" value={this.props.data.hours} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="row form-group ">
                                                <label className="col-sm-4 col-form-label ">
                                                    Study days:
                                            </label>
                                                <div className="col-sm-8">
                                                    <Select
                                                        isMulti
                                                        value={this.state.selectedStudyDays}
                                                        name="study_days"
                                                        options={this.state.weekday}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        onChange={this.changeStudyDays}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
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
