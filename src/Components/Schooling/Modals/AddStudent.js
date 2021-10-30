import React, { Component } from 'react'
import Select from 'react-select';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class AddStudent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            studyDays: false,
            initialContact: false,
            studySpecs: false,
            personofContact: false,
            corparate: false,
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
            clients: [],
            selectedStudyDays: [],
            selectedLessons: [],
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
    changeLesson = selectedOption => {
        let newData = this.state.data;
        newData['selectedLessons'] = selectedOption

        this.setState({
            data: newData,
            selectedLessons: selectedOption
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
            
            
            let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/student/study_days/${this.props.edit}`)
            if (response.data.status === 'success') {
                let array = []
                for (const [keys, value] of Object.entries(response.data.study_days)) {
                    if(keys !== 'id' && keys !== 'company' && keys !== 'created_at'  && keys !== 'deleted_at' && keys !== 'updated_at' && keys !== 'student' && value === 1){
                        array.push({ value: keys.toLowerCase(), label: capitalize(keys) })
                    }
                }
                this.changeStudyDays(array)
            }
            let response2 = await axios.post(`${process.env.REACT_APP_API_URL}/managers/student/lessons/${this.props.edit}`)
            if (response2.data.status === 'success') {
                let array = []
                if (response2.data.lessons.length > 0) {
                    response2.data.lessons.forEach(element => {
                        array.push({ value: element.lesson, label: element.lesson_name })
                    });
                }
                this.changeLesson(array)
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
            let lessons = []
            lesson_res.data.lesson.forEach(element => {
                lessons.push({ value: element.id, label: element.title })
            });
            this.setState({
                lessons: lessons
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
        let clients_res = await axios.get(`${process.env.REACT_APP_API_URL}/managers/clients`)
        if (clients_res.data.status === 'success') {
            this.setState({
                clients: clients_res.data.clients
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
            response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/students`, data)
        }
        else {
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/students/${this.props.edit}`, data)
        }
        if (response.data.status === 'success') {
            NotificationManager.success('Tələbə əlavə edildi.', 'Success', 5000);
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
                <div className="modal fade bd-example-modal-lg hide-modal" id="exampleModal" onClick={this.click} data-edit={this.props.edit} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg hide-modal" role="document">
                        <form onSubmit={this.sendForm}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel"> {(this.props.edit) ? 'Edit' : 'Add'} student</h5>
                                    <button type="button" className="close hide-modal" data-dismiss="modal" aria-label="Close">
                                        <span className="hide-modal" aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">

                                    <div className="form-group row">
                                        <div className="col-sm-4">
                                            <input type="text" className="form-control" placeholder="First Name" name="first_name" value={this.props.data.first_name} onChange={this.handleFormData} />
                                        </div>
                                        <div className="col-sm-4">
                                            <input type="text" className="form-control" placeholder="Last Name" name="last_name" value={this.props.data.last_name} onChange={this.handleFormData} />
                                        </div>
                                        <div className="col-sm-4">
                                            <input type="text" className="form-control" placeholder="Password" name="password" onChange={this.handleFormData} />
                                        </div>

                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-6">
                                            <div className="row">
                                                <label className="col-sm-4 col-form-label" >
                                                    Date of birth:
                                        </label>
                                                <div className="col-sm-8">
                                                    <input type="date" className="form-control" name="date" value={this.props.data.date} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <select className="form-control" name="gender" value={this.props.data.gender} onChange={this.handleFormData} >
                                                <option value="">-- Gender --</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                        </div>

                                    </div>
                                    <div className="form-group row">
                                        <div className="col-sm-4">
                                            <input type="email" placeholder="Email" className="form-control" name="email" value={this.props.data.email} onChange={this.handleFormData} />
                                        </div>
                                        <div className="col-sm-4">
                                            <input type="tel" placeholder="Mobile" className="form-control" name="mobile" value={this.props.data.mobile} onChange={this.handleFormData} />
                                        </div>
                                        <div className="col-sm-4">
                                            <input type="tel" placeholder="Phone" className="form-control" name="phone" value={this.props.data.phone} onChange={this.handleFormData} />
                                        </div>
                                    </div>
                                    <div className="row form-group">
                                        <div className="col-sm-4">
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
                                        <div className="col-sm-4">
                                            <select className="form-control" name="status" value={this.props.data.status} onChange={this.handleFormData}>
                                                <option>-- Status --</option>
                                                {
                                                    this.state.status.map((value, index) => {
                                                        if (this.props.data.status === index) {
                                                            return <option key={index} value={index} selected>{value}</option>
                                                        }
                                                        else {
                                                            return <option key={index} value={index}>{value}</option>
                                                        }
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12">
                                                    <a href="javascript:void(0)" onClick={() => this.setState({ studyDays: !this.state.studyDays })}>
                                                        <span style={{ fontSize: '1em' }} className="mr-1"><i className={(this.state.studyDays) ? 'fas fa-caret-down' : 'fas fa-caret-right'}></i></span>
                                                    Study days:
                                                </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={(this.state.studyDays) ? { display: 'block' } : { display: 'none' }}>
                                        <div className="col-12">
                                            <div className="row form-group">
                                                <div className="col-sm-6">
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
                                    <div className="form-group row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12">
                                                    <a href="javascript:void(0)" onClick={() => this.setState({ initialContact: !this.state.initialContact })}>
                                                        <span style={{ fontSize: '1em' }} className="mr-1"><i className={(this.state.initialContact) ? 'fas fa-caret-down' : 'fas fa-caret-right'}></i></span>
                                                Initial contact and personal goal:
                                            </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={(this.state.initialContact) ? { display: 'block' } : { display: 'none' }}>
                                        <div className="col-12">
                                            <div className="row form-group">
                                                <div className="col-sm-4">
                                                    <input type="date" className="form-control" name="initial_date" value={this.props.data.initial_date} onChange={this.handleFormData} />
                                                </div>
                                                <div className="col-sm-4">
                                                    <select className="form-control" name="purpose" value={this.props.data.purpose} onChange={this.handleFormData}>
                                                        <option value="">-- Personal goal --</option>
                                                        <option value="for work">for work</option>
                                                        <option value="for myself">for myself</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row form-group">
                                                <div className="col-sm-4">
                                                    <select className="form-control" name="initial_contact" value={this.props.data.initial_contact} onChange={this.handleFormData}>
                                                        <option>-- Initial contact via --</option>
                                                        <option value="call">Call</option>
                                                        <option value="letter">Letter</option>
                                                        <option value="personal">Personal</option>
                                                        <option value="website">Website</option>
                                                        <option value="social network">Social network</option>
                                                        <option value="leaflet">Leaflet</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12">
                                                    <a href="javascript:void(0)" onClick={() => this.setState({ studySpecs: !this.state.studySpecs })}>
                                                        <span style={{ fontSize: '1em' }} className="mr-1"><i className={(this.state.studySpecs) ? 'fas fa-caret-down' : 'fas fa-caret-right'}></i></span>
                                                Study specs
                                            </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={(this.state.studySpecs) ? { display: 'block' } : { display: 'none' }}>
                                        <div className="col-12">
                                            <div className="row form-group">
                                                <div className="col-sm-4">
                                                    <Select
                                                        isMulti
                                                        name="lessons"
                                                        value={this.state.selectedLessons}
                                                        options={this.state.lessons}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        onChange={this.changeLesson}
                                                    />
                                                </div>
                                                <div className="col-sm-4">
                                                    <select className="form-control" name="level" value={this.props.data.level} onChange={this.handleFormData}>
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
                                            <div className="row form-group">
                                                <div className="col-sm-4">
                                                    <select className="form-control" name="age_category" value={this.props.data.age_category} onChange={this.handleFormData}>
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
                                                <div className="col-sm-4">
                                                    <select className="form-control">
                                                        <option value="" name="learning_type" value={this.props.data.learning_type} onChange={this.handleFormData}>-- Learning Type --</option>
                                                        {
                                                            this.state.learning_type.map((value, index) => {
                                                                if (this.props.data.learning_type === value.id) {
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
                                    <div className="form-group row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12">
                                                    <a href="javascript:void(0)" onClick={() => this.setState({ personofContact: !this.state.personofContact })}>
                                                        <span style={{ fontSize: '1em' }} className="mr-1"><i className={(this.state.personofContact) ? 'fas fa-caret-down' : 'fas fa-caret-right'}></i></span>
                                                Person of contact
                                            </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={(this.state.personofContact) ? { display: 'block' } : { display: 'none' }}>
                                        <div className="col-12">
                                            <div className="row form-group">
                                                <div className="col-sm-4">
                                                    <input type="text" placeholder="First name" className="form-control" name="person_first_name" value={this.props.data.person_first_name} onChange={this.handleFormData} />
                                                </div>
                                                <div className="col-sm-4">
                                                    <input type="text" placeholder="Last name" className="form-control" name="person_last_name" value={this.props.data.person_last_name} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                            <div className="row form-group">
                                                <div className="col-sm-4">
                                                    <input type="text" placeholder="Relationship" className="form-control" name="person_relationship" value={this.props.data.person_relationship} onChange={this.handleFormData} />
                                                </div>
                                                <div className="col-sm-4">
                                                    <input type="tel" placeholder="Mobile" className="form-control" name="person_mobile" value={this.props.data.person_mobile} onChange={this.handleFormData} />
                                                </div>
                                                <div className="col-sm-4">
                                                    <input type="email" placeholder="Email" className="form-control" name="person_email" value={this.props.data.person_email} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12">
                                                    <a href="javascript:void(0)" onClick={() => this.setState({ corparate: !this.state.corparate })}>
                                                        <span style={{ fontSize: '1em' }} className="mr-1"><i className={(this.state.corparate) ? 'fas fa-caret-down' : 'fas fa-caret-right'}></i></span>
                                                Corparate Customer
                                            </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" style={(this.state.corparate) ? { display: 'block' } : { display: 'none' }}>
                                        <div className="col-12">
                                            <div className="row form-group">
                                                <div className="col-sm-4">
                                                    <select className="form-control" name="corparate" value={this.props.data.corparate} onChange={this.handleFormData}>
                                                        <option value="">-- Corparate clients --</option>
                                                        {
                                                            this.state.clients.map((value, index) => {
                                                                if (this.props.data.corparate === value.id) {
                                                                    return <option key={index} value={value.id} selected>{value.name}</option>
                                                                }
                                                                else {
                                                                    return <option key={index} value={value.id}>{value.name}</option>
                                                                }
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className="col-sm-4">
                                                    <input className="form-control" type="text" placeholder="Corparate Position" name="corparate_position" value={this.props.data.corparate_position} onChange={this.handleFormData} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row form-group mt-2">
                                        <div className="col-12">
                                            <div className="row">
                                                <label className="col-sm-3 col-form-label">
                                                    Note:
                                        </label>
                                                <div className="col-sm-9 mt-3 mt-sm-0">
                                                    <textarea className="form-control" name="note" value={this.props.data.note} onChange={this.handleFormData} ></textarea>
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
