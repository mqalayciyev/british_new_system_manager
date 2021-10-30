import React, { Component } from 'react'
import Select from 'react-select';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class AddGroupLessons extends Component {
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
            offices: [],
            levels: [],
            lessons: [],
            age_category: [],
            learning_type: [],
            price: [],
            teacher: [],
            selectedStudyDays: [],
            status: ['Resigned', 'Works', 'Intern', 'On Holiday']
        };
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
        this.setState({data: this.props.data})
        const capitalize = (s) => {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        }
        
        if (this.props.edit > 0) {
            
            
            let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/group/study_days/${this.props.edit}`)
            if (response.data.status === 'success') {
                let array = []
                for (const [keys, value] of Object.entries(response.data.study_days)) {
                    if(keys !== 'id' && keys !== 'company' && keys !== 'created_at'  && keys !== 'deleted_at' && keys !== 'updated_at' && keys !== 'group' && value === 1){
                        array.push({ value: keys.toLowerCase(), label: capitalize(keys) })
                    }
                }
                this.changeStudyDays(array)
            }
        }
        let offices_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/offices`)
        if(offices_res.data.status === 'success'){
            this.setState({
                offices: offices_res.data.offices
            })
        }

        let level_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/level`)
        if (level_res.data.status === 'success') {
            this.setState({
                levels: level_res.data.level
            })
        }

        let lesson_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/lesson`)
        if (lesson_res.data.status === 'success') {
            this.setState({
                lessons: lesson_res.data.lesson
            })
        }
        let age_cat_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/age_category`)
        if (age_cat_res.data.status === 'success') {
            this.setState({
                age_category: age_cat_res.data.age_category
            })
        }
        let learning_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/learning_type`)
        if (learning_res.data.status === 'success') {
            this.setState({
                learning_type: learning_res.data.learning_type
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
            response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/group`, data)
        }
        else {
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/group/${this.props.edit}`, data)
        }
        if (response.data.status === 'success') {
            NotificationManager.success('Group əlavə edildi.', 'Success', 5000);
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
            <div class="modal d-block bd-example-modal-lg hide-modal" id="exampleModal" onClick={this.click} data-edit={this.props.edit}  tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg hide-modal" role="document">
                <form onSubmit={this.sendForm}>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">{(this.props.edit) ? 'Edit' : 'Add new '} group lesson</h5>
                            <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                <span className="hide-modal" aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            
                                <div class="row">
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label">
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
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label text-sm-center">
                                                Group status:
                                            </label>
                                            <div className="col-sm-8">
                                                <select className="form-control" name="status" value={this.props.data.status} onChange={this.handleFormData}>
                                                    <option value="1">Actual</option>
                                                    <option value="2">Complete</option>
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
                                            Age category:

                                            </label>
                                            <div className="col-sm-8">
                                                <select className="form-control" name="age_category" onChange={this.handleFormData}>
                                                    <option value="">-- Age category --</option>
                                                    {
                                                        this.state.age_category.map((value, index) => {
                                                            if (this.props.data.age_category === value.id) {
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
                                            <label className="col-sm-4 col-form-label text-sm-center">
                                            Learning Type:
                                            </label>
                                            <div className="col-sm-8">
                                                <select className="form-control" name="type" onChange={this.handleFormData}>
                                                    <option value="">-- Type --</option>
                                                    {
                                                        this.state.learning_type.map((value, index) => {
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
                                </div>
                                <div class="row">
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
                                            <label className="col-sm-4 col-form-label text-sm-center">
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
                                <div class="row">
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                        <label className="col-sm-4 col-form-label">
                                            Hours:
                                            </label>
                                            <div className="col-sm-8">
                                                <input type="number" className="form-control" name="hours" value={this.props.data.hours} onChange={this.handleFormData} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label text-sm-center">
                                            Teacher:
                                            </label>
                                            <div className="col-sm-8">
                                                <select className="form-control" name="teacher" onChange={this.handleFormData}>
                                                    <option value="">-- Teacher --</option>
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
                                            Name:
                                            </label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control" name="name" value={this.props.data.name} onChange={this.handleFormData}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label text-sm-center">
                                            Capacity:
                                            </label>
                                            <div className="col-sm-8">
                                                <input type="number" className="form-control" name="capacity" value={this.props.data.capacity} onChange={this.handleFormData} />
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
