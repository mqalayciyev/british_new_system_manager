import React, { Component } from 'react'
import Select from 'react-select';
import axios from 'axios';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class AddAcademicStaff extends Component {

    constructor(props){
        super(props)
        this.state = {
            
            offices: [],
            salary: [],
            lessons: [],
            levels: [],
            data: {},
            selectedLevels: [],
            selectedLessons: [],
            status: ['Resigned', 'Works', 'Intern', 'On Holiday'],
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
        let level_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/level`)

        if (level_res.data.status === 'success') {
            let levels = []
            if (level_res.data.level.length > 0) {
                console.log(level_res.data)
                level_res.data.level.forEach(element => {
                    levels.push({ value: element.id, label: element.title })
                });
            }
            this.setState({
                levels: levels
            })
        }

        let lesson_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/lesson`)
        if (lesson_res.data.status === 'success') {
            let lessons = []
            lesson_res.data.lesson.forEach(element => {
                lessons.push({ value: element.id, label: element.title })
            });
            this.setState({
                lessons: lessons
            })
        }

        let salary_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/teachers_payment`)
        if (salary_res.data.status === 'success') {
            let salary = []

            salary_res.data.teachers_payment.forEach(element => {
                salary.push({ value: element.id, label: element.title + " - " + element.minutes + " / " + element.price })
            });
            this.setState({
                salary: salary
            })
        }
        let data = this.props.data ? this.props.data : {}

        console.log(data)
        let selectedLessons = data.lessons ? data.lessons : []
        let selectedLevels = data.levels ? data.levels : []
        this.setState({ data: data, selectedLessons: selectedLessons, selectedLevels: selectedLevels})

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

    changeLevel = selectedOption => {
        let newData = this.state.data;
        newData['levels'] = selectedOption
        this.setState({data: newData, selectedLevels: selectedOption})
    };
    changeLesson = selectedOption => {
        let newData = this.state.data;
        newData['lessons'] = selectedOption
        this.setState({data: newData, selectedLessons: selectedOption})
    };

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
            response= await axios.post(`${process.env.REACT_APP_API_URL}/managers/teacher`, data)
        }
        else{
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/teacher/${this.props.edit}`, data)
        }

        console.log(data)

        // return false;

        if(response.data.status === 'success'){
            NotificationManager.success('Müəllim əlavə edildi.', 'Success', 5000);
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
                            <h5 class="modal-title" id="exampleModalLabel">{(this.props.edit) ? 'Edit' : 'Add'} academic staff</h5>
                            <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                <span className="hide-modal" aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            
                                <div class="form-group row">
                                <div className="col-6">
                                        <select className="form-control w-100" name="type" value={this.props.data.type} onChange={this.handleFormData}>
                                            <option value="">--Type--</option>
                                            <option value="2">Teacher</option>
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
                                                <input type="text" placeholder="First name" className="form-control" name="first_name" value={this.props.data.first_name} onChange={this.handleFormData}/>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" placeholder="Last name" className="form-control" name="last_name" value={this.props.data.last_name} onChange={this.handleFormData}/>
                                            </div>
                                            <div className="col-sm-4">
                                                <input type="text" placeholder="Address" className="form-control" name="address" value={this.props.data.address} onChange={this.handleFormData}/>
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
                                                        <select className="form-control" name="office" onChange={this.handleFormData}>
                                                            <option value="">--Office--</option>
                                                            {
                                                                this.state.offices.map((value, index)=>{
                                                                    if(this.props.data.office == value.id){
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
                                    <div className="col-sm-6">
                                                <div className="row">
                                                    <label className="col-4 col-sm-6 col-form-label">
                                                    Lesson:
                                                    </label>
                                                    <div className="col-8 col-sm-6">
                                                        <Select
                                                            value={this.state.selectedLessons}
                                                            isMulti
                                                            name="lessons"
                                                            options={this.state.lessons}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            onChange={this.changeLesson}
														/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="row">
                                                    <label className="col-4 col-sm-6 col-form-label text-sm-center">
                                                    Salary:
                                                    </label>
                                                    <div className="col-8 col-sm-6">
                                                        <select className="form-control" name="salary" onChange={this.handleFormData}>
                                                        <option value="">--Salary--</option>
                                                            {
                                                                this.state.salary.map((value, index)=>{
                                                                    if(this.props.data.salary == value.value){
                                                                        return <option key={index} selected value={value.value}>{value.label}</option>
                                                                    }
                                                                    else{
                                                                        return <option key={index} value={value.value}>{value.label}</option>
                                                                    }
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                </div>
                                <div class="form-group row">
                                    <div className="col-sm-6">
                                                <div className="row">
                                                    <label className="col-4 col-sm-6 col-form-label">
                                                    Level:
                                                    </label>
                                                    <div className="col-8 col-sm-6">
                                                        <Select
                                                            value={this.state.selectedLevels}
                                                            isMulti
                                                            name="levels"
                                                            options={this.state.levels}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            onChange={this.changeLevel}
														/>
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
