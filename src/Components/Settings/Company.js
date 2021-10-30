import React, { Component } from 'react'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SessionContext } from "../../Context/Session";
import $ from 'jquery';
import '../../CSS/style.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import img from '../../img/company.png';

export default class Company extends Component {
    static contextType = SessionContext;
    constructor(props) {
        super(props)

        let userInfo = JSON.parse(localStorage.getItem('user-info'))
        this.state = {
            img: userInfo.company.logo,
            show: false,
            delete: false,
            display: true,
            type: { title: '', name: '', action: '', id: '0' },
            companyFormData: {
                name: userInfo.company.name,
                mobile: userInfo.company.mobile,
                email: userInfo.company.email,
                currency: userInfo.company.currency,
                address: userInfo.company.address,
                phone: userInfo.company.phone,
                facebook: userInfo.company.facebook,
                instagram: userInfo.company.instagram,
                twitter: userInfo.company.twitter,
                youtube: userInfo.company.youtube,
                linkedin: userInfo.company.linkedin,
            },
            formData: {
                title: '',
                note: '',
                minutes: '',
                price: ''
            },
            lesson: [],
            level: [],
            learning_type: [],
            exam_type: [],
            age_category: [],
            academic_hour: [],
            teachers_payment: [],

        };
    }
    componentDidMount = () => {
        this.handleSettings('lesson')
        this.handleSettings('level')
        this.handleSettings('learning_type')
        this.handleSettings('exam_type')
        this.handleSettings('age_category')
        this.handleSettings('academic_hour')
        this.handleSettings('teachers_payment')
    }
    handleSettings = async name => {
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/${name}`)
        if (response.data.status === 'success') {
            let data = response.data[name]
            this.setState({
                [name]: data,
                deleteData: userInfo.user.user_info.type === 1 ? true : false,
                display: false
            })
        }

    }
    handleCompanyState = event => {
        let value = event.target.value
        let name = event.target.name
        let newCompanyFormData = this.state.companyFormData;
        newCompanyFormData[name] = value
        this.setState({
            companyFormData: newCompanyFormData
        })
    }

    handleSetState = event => {
        let value = event.target.value
        let name = event.target.name
        let newFormData = this.state.formData;
        newFormData[name] = value
        this.setState({
            formData: newFormData
        })
    }

    sendForm = async (event) => {
        event.preventDefault();
        var data = this.state.formData

        if (this.state.type.action === 'add') {


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
            let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/${this.state.type.name}`, data)
            if (response.data.status === 'success') {
                NotificationManager.success('Məlumat əlavə edildi.', 'Success', 5000);
                this.handleSettings(this.state.type.name)

            }
            if (response.data.status === 'error') {
                let message = response.data.message;
                for (const [key, value] of Object.entries(message)) {
                    console.log(key)
                    NotificationManager.error(value, 'Error', 5000);
                }
            }
        }
        else if (this.state.type.action === 'edit') {

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
            let response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/${this.state.type.name}/${this.state.type.id}`, data)
            if (response.data.status === 'success') {
                NotificationManager.success('Məlumatlar dəyişdirildi.', 'Success', 5000);
                this.handleSettings(this.state.type.name)
            }
            if (response.data.status === 'error') {
                let message = response.data.message;
                for (const [key, value] of Object.entries(message)) {
                    console.log(key)
                    NotificationManager.error(value, 'Error', 5000);
                }
            }

        }


    }
    delete = async (event) => {

        let link = (event.target.tagName === 'I') ? $(event.target).parent('button').data('link') : $(event.target).data('link');
        let id = (event.target.tagName === 'I') ? $(event.target).parent('button').data('id') : $(event.target).data('id');
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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/${link}/${id}`)
        if (response.data.status === 'success') {
            NotificationManager.success(response.data.message, 'Success', 5000);
            this.handleSettings(link)

        }
        if (response.data.status === 'error') {
            let message = response.data.message;
            for (const [key, value] of Object.entries(message)) {
                console.log(key)
                NotificationManager.error(value, 'Error', 5000);
            }
        }


    }


    companyForm = async (event) => {
        event.preventDefault();

        var data = this.state.companyFormData

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
        let response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/company/${userInfo.company.id}`, data)

        if (response.data.status === 'success') {
            NotificationManager.success('Məlumatlar dəyişdirildi.', 'Success', 5000);
            userInfo['company'] = response.data.company;
            console.log(userInfo)
            localStorage.setItem('user-info', JSON.stringify(userInfo))
            this.context.setSession(response.data.status, userInfo)
        }
        if (response.data.status === 'error') {
            let message = response.data.message;
            for (const [key, value] of Object.entries(message)) {
                console.log(key)
                NotificationManager.error(value, 'Error', 5000);
            }
        }
    }
    onConfirm = async e => {
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
        if(this.state.formData.file)
            formData.append("file", this.state.formData.file)


        let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/company/add_image`, formData)
        if(response.data.status === 'success'){
            NotificationManager.success('Məlumatlar dəyişdirildi.', 'Success', 5000);
            userInfo['company'] = response.data.company;
            localStorage.setItem('user-info', JSON.stringify(userInfo))
            this.context.setSession(response.data.status, userInfo)
            this.setState({img: response.data.image, show: false, formData: {}})
        }
        if(response.data.status === 'error'){
            let message = response.data.message;
            for (const [key, value] of Object.entries(message)) {
                console.log(key)
                NotificationManager.error(value, 'Error', 5000);
            }
            this.setState({formData: {}})
        }
    }
    onCancel =  () => {
        this.setState({show: false, formData: {}})
    }
    onDelete = async () => {
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
        let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/company/delete_image`)
        if(response.data.status === 'success'){
            NotificationManager.success('Məlumatlar dəyişdirildi.', 'Success', 5000);
            userInfo['company'] = response.data.company;
            localStorage.setItem('user-info', JSON.stringify(userInfo))
            this.context.setSession(response.data.status, userInfo)
            this.setState({img: null, delete: false, formData: {}})
        }
        if(response.data.status === 'error'){
            let message = response.data.message;
            for (const [key, value] of Object.entries(message)) {
                console.log(key)
                NotificationManager.error(value, 'Error', 5000);
            }
            this.setState({formData: {}})
        }
    }
    changeImage(event){

        let newFormData = this.state.formData;
        newFormData['file'] = event.target.files[0]
        this.setState({
            formData: newFormData
        })
    }

    render() {
        return (
            <>
                <NotificationContainer />
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                <h4>Company's settings</h4>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <div className="bg-white p-3 shadow">
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link active" id="course-tab" data-toggle="tab" href="#course" role="tab" aria-controls="course" aria-selected="true">Lesson</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="levels-tab" data-toggle="tab" href="#levels" role="tab" aria-controls="levels" aria-selected="false">Levels</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="types-tab" data-toggle="tab" href="#types" role="tab" aria-controls="types" aria-selected="false">Learning types</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="exam_types-tab" data-toggle="tab" href="#exam_types" role="tab" aria-controls="exam_types" aria-selected="false">Exam types</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="age-tab" data-toggle="tab" href="#age" role="tab" aria-controls="age" aria-selected="false">Age categories</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="hours-tab" data-toggle="tab" href="#hours" role="tab" aria-controls="hours" aria-selected="false">Academic hours</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="teachers-tab" data-toggle="tab" href="#teachers" role="tab" aria-controls="teachers" aria-selected="false">Teachers payments</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" id="others-tab" data-toggle="tab" href="#others" role="tab" aria-controls="others" aria-selected="false">Others</a>
                                        </li>
                                    </ul>
                                    <div className="loading" style={{ display: this.state.display ? 'block' : 'none', top: 'inherit', bottom: '38px'}}>
                                                <div className="text-center">
                                                    <span>
                                                        Loading...
                                                    </span>
                                                </div>
                                            </div>
                                    <div className="tab-content border border-top-0 rounded-bottom" id="myTabContent">
                                        <div className="tab-pane fade show active" id="course" role="tabpanel" aria-labelledby="course-tab">
                                            <div className="col-12 bg-light py-2 px-3">
                                                <div className="row">
                                                    <div className="col-sm-6"><h5 className="m-0">Lessons</h5></div>
                                                    <div className="col-sm-6 text-right">
                                                        <button className="btn btn-primary py-1" onClick={() => this.setState({ type: { title: 'Lesson', name: 'lesson', action: 'add', id: '0' } })} data-toggle="modal" data-target="#exampleModal">Add</button>
                                                    </div>
                                                </div>
                                            </div>

                                            
                                            

                                            <div className="table-responsive bg-white m-0 p-3 rounded ">
                                                <table className="table table-bordered m-0">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Title</th>
                                                            <th scope="col">Description</th>
                                                            <th scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {this.state.lesson.length > 0 ? this.state.lesson.map((value, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {value.title}
                                                                    </td>
                                                                    <td>
                                                                        {value.note}
                                                                    </td>
                                                                    <td className="btnTD text-center">
                                                                        <p><button className="btn Btn32 btn-warning" onClick={() => this.setState({ type: { title: 'Lesson', name: 'lesson', action: 'edit', id: value.id }, formData: { title: value.title, note: value.note } })} data-toggle="modal" data-target="#exampleModal"><i className="fas fa-pencil-alt"></i></button></p>
                                                                        <p>
                                                                        {
                                                                            this.state.deleteData ? <button className="btn Btn32 btn-danger" data-id={value.id} data-link="lesson" onClick={this.delete}><i className="fas fa-trash"></i></button> : ''
                                                                        }
                                                                        </p>
                                                                        {/* <p><button className="btn Btn32 btn-info"><i className="fas fa-eye"></i></button></p> */}

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
                                        <div className="tab-pane fade" id="levels" role="tabpanel" aria-labelledby="levels-tab">
                                            <div className="col-12 bg-light py-2 px-3">
                                                <div className="row">
                                                    <div className="col-sm-6"><h5 className="m-0">Levels</h5></div>
                                                    <div className="col-sm-6 text-right">
                                                        <button className="btn btn-primary py-1" onClick={() => this.setState({ type: { title: 'Level', name: 'level', action: 'add', id: '0' } })} data-toggle="modal" data-target="#exampleModal">Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-responsive bg-white m-0 p-3 rounded ">
                                                <table className="table table-bordered m-0">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Title</th>
                                                            <th scope="col">Description</th>
                                                            <th scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.level.length > 0 ? this.state.level.map((value, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {value.title}
                                                                    </td>
                                                                    <td>
                                                                        {value.note}
                                                                    </td>
                                                                    <td className="btnTD text-center">
                                                                        <p><button className="btn Btn32 btn-warning" onClick={() => this.setState({ type: { title: 'Level', name: 'level', action: 'edit', id: value.id }, formData: { title: value.title, note: value.note } })} data-toggle="modal" data-target="#exampleModal"><i className="fas fa-pencil-alt"></i></button></p>
                                                                        <p>
                                                                        {
                                                                            this.state.deleteData ? <button className="btn Btn32 btn-danger" data-id={value.id} data-link="lesson" onClick={this.delete}><i className="fas fa-trash"></i></button> : ''
                                                                        }
                                                                        </p>
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
                                        <div className="tab-pane fade" id="types" role="tabpanel" aria-labelledby="types-tab">
                                            <div className="col-12 bg-light py-2 px-3">
                                                <div className="row">
                                                    <div className="col-sm-6"><h5 className="m-0">Learning types</h5></div>
                                                    <div className="col-sm-6 text-right">
                                                        <button className="btn btn-primary py-1" onClick={() => this.setState({ type: { title: 'Learning Type', name: 'learning_type', action: 'add', id: '0' } })} data-toggle="modal" data-target="#exampleModal">Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-responsive bg-white m-0 p-3 rounded ">
                                                <table className="table table-bordered m-0">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Title</th>
                                                            <th scope="col">Description</th>
                                                            <th scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.learning_type.length > 0 ? this.state.learning_type.map((value, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {value.title}
                                                                    </td>
                                                                    <td>
                                                                        {value.note}
                                                                    </td>
                                                                    <td className="btnTD text-center">
                                                                        <p><button className="btn Btn32 btn-warning" onClick={() => this.setState({ type: { title: 'Learning Type', name: 'learning_type', action: 'edit', id: value.id }, formData: { title: value.title, note: value.note } })} data-toggle="modal" data-target="#exampleModal"><i className="fas fa-pencil-alt"></i></button></p>
                                                                        <p>
                                                                        {
                                                                            this.state.deleteData ? <button className="btn Btn32 btn-danger" data-id={value.id} data-link="lesson" onClick={this.delete}><i className="fas fa-trash"></i></button> : ''
                                                                        }
                                                                        </p>
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
                                        <div className="tab-pane fade" id="exam_types" role="tabpanel" aria-labelledby="exam_types-tab">
                                            <div className="col-12 bg-light py-2 px-3">
                                                <div className="row">
                                                    <div className="col-sm-6"><h5 className="m-0">Exam types</h5></div>
                                                    <div className="col-sm-6 text-right">
                                                        <button className="btn btn-primary py-1" onClick={() => this.setState({ type: { title: 'Exam Type', name: 'exam_type', action: 'add', id: '0' } })} data-toggle="modal" data-target="#exampleModal">Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-responsive bg-white m-0 p-3 rounded ">
                                                <table className="table table-bordered m-0">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Title</th>
                                                            <th scope="col">Description</th>
                                                            <th scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.exam_type.length > 0 ? this.state.exam_type.map((value, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {value.title}
                                                                    </td>
                                                                    <td>
                                                                        {value.note}
                                                                    </td>
                                                                    <td className="btnTD text-center">
                                                                        <p><button className="btn Btn32 btn-warning" onClick={() => this.setState({ type: { title: 'Exam Type', name: 'exam_type', action: 'edit', id: value.id }, formData: { title: value.title, note: value.note } })} data-toggle="modal" data-target="#exampleModal"><i className="fas fa-pencil-alt"></i></button></p>
                                                                        <p>
                                                                        {
                                                                            this.state.deleteData ? <button className="btn Btn32 btn-danger" data-id={value.id} data-link="lesson" onClick={this.delete}><i className="fas fa-trash"></i></button> : ''
                                                                        }
                                                                        </p>
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
                                        <div className="tab-pane fade" id="age" role="tabpanel" aria-labelledby="age-tab">
                                            <div className="col-12 bg-light py-2 px-3">
                                                <div className="row">
                                                    <div className="col-sm-6"><h5 className="m-0">Age categories</h5></div>
                                                    <div className="col-sm-6 text-right">
                                                        <button className="btn btn-primary py-1" onClick={() => this.setState({ type: { title: 'Age Category', name: 'age_category', action: 'add', id: '0' } })} data-toggle="modal" data-target="#exampleModal">Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-responsive bg-white m-0 p-3 rounded ">
                                                <table className="table table-bordered m-0">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Title</th>
                                                            <th scope="col">Description</th>
                                                            <th scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.age_category.length > 0 ? this.state.age_category.map((value, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {value.title}
                                                                    </td>
                                                                    <td>
                                                                        {value.note}
                                                                    </td>
                                                                    <td className="btnTD text-center">
                                                                        <p><button className="btn Btn32 btn-warning" onClick={() => this.setState({ type: { title: 'Age Category', name: 'age_category', action: 'edit', id: value.id }, formData: { title: value.title, note: value.note } })} data-toggle="modal" data-target="#exampleModal"><i className="fas fa-pencil-alt"></i></button></p>
                                                                        <p>
                                                                        {
                                                                            this.state.deleteData ? <button className="btn Btn32 btn-danger" data-id={value.id} data-link="lesson" onClick={this.delete}><i className="fas fa-trash"></i></button> : ''
                                                                        }
                                                                        </p>
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
                                        <div className="tab-pane fade" id="hours" role="tabpanel" aria-labelledby="hours-tab">
                                            <div className="col-12 bg-light py-2 px-3">
                                                <div className="row">
                                                    <div className="col-sm-6"><h5 className="m-0">Academic hours</h5></div>
                                                    <div className="col-sm-6 text-right">
                                                        <button className="btn btn-primary py-1" onClick={() => this.setState({ type: { title: 'Academic hours', name: 'academic_hour', action: 'add', id: '0' }, formData: { title: '', note: '', minutes: '' } })} data-toggle="modal" data-target="#academicModal">Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-responsive bg-white m-0 p-3 rounded ">
                                                <table className="table table-bordered m-0">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Minutes</th>
                                                            <th scope="col">Price  {`(${this.state.companyFormData.currency})`}</th>
                                                            <th scope="col">Description</th>
                                                            <th scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.academic_hour.length > 0 ? this.state.academic_hour.map((value, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {value.minutes} Deqiqe
                                                            </td>
                                                                    <td>
                                                                        {value.price}  {`(${this.state.companyFormData.currency})`}
                                                                    </td>
                                                                    <td>
                                                                        {value.note}
                                                                    </td>
                                                                    <td className="btnTD text-center">
                                                                        <p><button className="btn Btn32 btn-warning" onClick={() => this.setState({ type: { title: 'Academic hours', name: 'academic_hour', action: 'edit', id: value.id }, formData: { minutes: value.minutes, note: value.note, price: value.price } })} data-toggle="modal" data-target="#academicModal"><i className="fas fa-pencil-alt"></i></button></p>
                                                                        <p>
                                                                        {
                                                                            this.state.deleteData ? <button className="btn Btn32 btn-danger" data-id={value.id} data-link="lesson" onClick={this.delete}><i className="fas fa-trash"></i></button> : ''
                                                                        }
                                                                        </p>
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
                                        <div className="tab-pane fade" id="teachers" role="tabpanel" aria-labelledby="teachers-tab">
                                            <div className="col-12 bg-light py-2 px-3">
                                                <div className="row">
                                                    <div className="col-sm-6"><h5 className="m-0">Teachers payments</h5></div>
                                                    <div className="col-sm-6 text-right">
                                                        <button className="btn btn-primary py-1" onClick={() => this.setState({ type: { title: 'Teachers payments', name: 'teachers_payment', action: 'add', id: '0' }, formData: { title: '', note: '', minutes: '', price: '' } })} data-toggle="modal" data-target="#salaryModal">Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-responsive bg-white m-0 p-3 rounded ">
                                                <table className="table table-bordered m-0">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Title</th>
                                                            <th scope="col">Minutes</th>
                                                            <th scope="col">Price  {`(${this.state.companyFormData.currency})`}</th>
                                                            <th scope="col">Description</th>
                                                            <th scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.teachers_payment.length > 0 ? this.state.teachers_payment.map((value, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {value.title}
                                                                    </td>
                                                                    <td>
                                                                        {value.minutes}
                                                                    </td>
                                                                    <td>
                                                                        {value.price} {`(${this.state.companyFormData.currency})`}
                                                                    </td>
                                                                    <td>
                                                                        {value.note}
                                                                    </td>
                                                                    <td className="btnTD text-center">
                                                                        <p><button className="btn Btn32 btn-warning" onClick={() => this.setState({ type: { title: 'Teachers payments', name: 'teachers_payment', action: 'edit', id: value.id }, formData: { title: value.title, note: value.note, minutes: value.minutes, price: value.price } })} data-toggle="modal" data-target="#salaryModal"><i className="fas fa-pencil-alt"></i></button></p>
                                                                        <p>
                                                                        {
                                                                            this.state.deleteData ? <button className="btn Btn32 btn-danger" data-id={value.id} data-link="lesson" onClick={this.delete}><i className="fas fa-trash"></i></button> : ''
                                                                        }
                                                                        </p>
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
                                        {
                                            this.state.deleteData ? 
                                        <div className="tab-pane fade" id="others" role="tabpanel" aria-labelledby="locations-tab">
                                            <div className="col-12 bg-light py-2 px-3">
                                                <div className="row">
                                                    <div className="col-12"><h5 className="m-0">Others</h5></div>
                                                </div>
                                            </div>
                                            <form id="companyForm" onSubmit={this.companyForm} className="py-3">
                                                <div className="col-12 px-3 py-2">
                                                    <div className="row">
                                                        <div className="col-sm-6">Organization name in the title:</div>
                                                        <div className="col-sm-6"><input className="form-control" type="text" name="name" onChange={this.handleCompanyState} value={this.state.companyFormData.name} /></div>
                                                    </div>
                                                </div>
                                                <div className="col-12 px-3 py-2">
                                                    <div className="row">
                                                        <div className="col-sm-6">Address:</div>
                                                        <div className="col-sm-6"><input className="form-control" type="text" name="address" onChange={this.handleCompanyState} value={this.state.companyFormData.address} /></div>
                                                    </div>
                                                </div>
                                                <div className="col-12 px-3 py-2">
                                                    <div className="row">
                                                        <div className="col-sm-6">Mobile:</div>
                                                        <div className="col-sm-6"><input className="form-control" type="text" name="mobile" onChange={this.handleCompanyState} value={this.state.companyFormData.mobile} /></div>
                                                    </div>
                                                </div>
                                                <div className="col-12 px-3 py-2">
                                                    <div className="row">
                                                        <div className="col-sm-6">Phone:</div>
                                                        <div className="col-sm-6"><input className="form-control" type="text" name="phone" onChange={this.handleCompanyState} value={this.state.companyFormData.phone} /></div>
                                                    </div>
                                                </div>
                                                <div className="col-12 px-3 py-2">
                                                    <div className="row">
                                                        <div className="col-sm-6">Email:</div>
                                                        <div className="col-sm-6"><input className="form-control" type="text" name="email" onChange={this.handleCompanyState} value={this.state.companyFormData.email} /></div>
                                                    </div>
                                                </div>
                                                <div className="col-12 px-3 py-2">
                                                    <div className="row">
                                                        <div className="col-sm-6">Currency:</div>
                                                        <div className="col-sm-6">
                                                            <select className="form-control" name="currency" onChange={this.handleCompanyState} value={this.state.companyFormData.currency}>
                                                                <option value="" >-- Currency --</option>
                                                                <option value="azn" >AZN</option>
                                                                <option value="dollars">DOLLARS</option>
                                                                <option value="rubl">RUBL</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 px-3 py-2">
                                                    <div className="row">
                                                        <div className="col-sm-6">Facebook:</div>
                                                        <div className="col-sm-6"><input className="form-control" type="url" name="facebook" onChange={this.handleCompanyState} value={this.state.companyFormData.facebook} /></div>
                                                    </div>
                                                </div>
                                                <div className="col-12 px-3 py-2">
                                                    <div className="row">
                                                        <div className="col-sm-6">Twitter:</div>
                                                        <div className="col-sm-6"><input className="form-control" type="url" name="twitter" onChange={this.handleCompanyState} value={this.state.companyFormData.twitter} /></div>
                                                    </div>
                                                </div>
                                                <div className="col-12 px-3 py-2">
                                                    <div className="row">
                                                        <div className="col-sm-6">Instagram:</div>
                                                        <div className="col-sm-6"><input className="form-control" type="url" name="instagram" onChange={this.handleCompanyState} value={this.state.companyFormData.instagram} /></div>
                                                    </div>
                                                </div>
                                                <div className="col-12 px-3 py-2">
                                                    <div className="row">
                                                        <div className="col-sm-6">Linkedin:</div>
                                                        <div className="col-sm-6"><input className="form-control" type="url" name="linkedin" onChange={this.handleCompanyState} value={this.state.companyFormData.linkedin} /></div>
                                                    </div>
                                                </div>
                                                <div className="col-12 px-3 py-2">
                                                    <div className="row">
                                                        <div className="col-sm-6">Youtube:</div>
                                                        <div className="col-sm-6"><input className="form-control" type="url" name="youtube" onChange={this.handleCompanyState} value={this.state.companyFormData.youtube} /></div>
                                                    </div>
                                                </div>
                                                <div className="col-12 px-3 py-2">
                                                    <div className="row">
                                                        <div className="col-sm-6">School logo:</div>
                                                        <div className="col-sm-6">
                                                            <div className="row company_image">
                                                                <div className="rounded-circle actions">
                                                                    <button type="button" className="btn btn-success" onClick={() => this.setState({ show: true })}><i className="fa fa-plus"></i></button>
                                                                    <button type="button" className="btn btn-danger ml-1" onClick={() => this.setState({ delete: true })} ><i className="fa fa-trash"></i></button>
                                                                </div>
                                                                <SweetAlert
                                                                    title={"Choose a new picture"}
                                                                    onConfirm={this.onConfirm}
                                                                    onCancel={this.onCancel}
                                                                    showCancel={`true`}
                                                                    show={this.state.show}
                                                                    confirmBtnBsStyle="success"
                                                                    confirmBtnText="Save"
                                                                    cancelBtnBsStyle="danger"
                                                                    dependencies={[this.state.image]}
                                                                >
                                                                    {() => (
                                                                        <form className="row from-group">
                                                                            <input
                                                                                type={'file'}
                                                                                className="form-control p-0"
                                                                                onChange={this.changeImage.bind(this)}
                                                                                // onChange={(e) => this.setState({ formData: e.target.files })}
                                                                            />
                                                                        </form>
                                                                    )}
                                                                </SweetAlert>

                                                                <SweetAlert
                                                                    title={"Are you sure?"}
                                                                    placeholder={"You won't be able to revert this!"}
                                                                    type={`warning`}
                                                                    onConfirm={this.onDelete}
                                                                    onCancel={() => this.setState({delete: false})}
                                                                    showCancel={`true`}
                                                                    show={this.state.delete}
                                                                    confirmBtnBsStyle="success"
                                                                    confirmBtnText="Yes, delete it!"                                        
                                                                    cancelBtnBsStyle="danger"
                                                                    cancelBtnText='No, cancel!'
                                                                />
                                                                <img src={this.state.img ? process.env.REACT_APP_URL + '/' +  this.state.img : img} style={{ width: '150px', height: '150px' }} className="rounded-circle" alt="user" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 text-right">
                                                    <button button="submit" className="btn btn-success py-1">Save</button>
                                                </div>
                                            </form>
                                        </div> : ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <form onSubmit={this.sendForm}>
                            <input type="hidden" name="type" value={this.state.type.name} />
                            <input type="hidden" name="id" value={this.state.type.id} />
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel" style={{ textTransform: 'capitalize' }}>{this.state.type.action} {this.state.type.title}</h5>
                                    <button type="button" className="close" onClick={() => this.setState({ type: [{ title: '', name: '', action: '', id: '0' }] })} data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group row">
                                        <input type="text" className='form-control mb-3' name="title" placeholder="Title" value={this.state.formData.title} onChange={this.handleSetState} />
                                        <textarea name="note" className="form-control" placeholder="Description" value={this.state.formData.note} onChange={this.handleSetState}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="reset" className="btn btn-secondary" onClick={() => this.setState({ type: { title: '', name: '', action: '', id: '0' }, formData: { title: '', note: '' } })} data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Save changes</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="modal fade" id="academicModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <form onSubmit={this.sendForm}>
                            <input type="hidden" name="id" value="" />
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel" style={{ textTransform: 'capitalize' }}>{this.state.type.action} {this.state.type.title}</h5>
                                    <button type="button" className="close" onClick={() => this.setState({ type: [{ title: '', name: '', action: '', id: '0' }] })} data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group row" >
                                        <input type="number" className='form-control mb-3' name="minutes" placeholder="Minutes" value={this.state.formData.minutes} onChange={this.handleSetState} />
                                        <input type="number" className='form-control mb-3' name="price" placeholder={`Price (${this.state.companyFormData.currency})`} value={this.state.formData.price} onChange={this.handleSetState} />
                                        <textarea name="note" className="form-control" placeholder="Description" value={this.state.formData.note} onChange={this.handleSetState}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="reset" className="btn btn-secondary" onClick={() => this.setState({ type: { title: '', name: '', action: '', id: '0' }, formData: { title: '', note: '', minutes: '' } })} data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Save changes</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="modal fade" id="salaryModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <form onSubmit={this.sendForm}>
                            <input type="hidden" name="id" value="" />
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel" style={{ textTransform: 'capitalize' }}>{this.state.type.action} {this.state.type.title}</h5>
                                    <button type="button" className="close" onClick={() => this.setState({ type: [{ title: '', name: '', action: '', id: '0' }] })} data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group row" >
                                        <input type="text" className='form-control mb-3' name="title" placeholder="Title" value={this.state.formData.title} onChange={this.handleSetState} />
                                        <input type="number" className='form-control mb-3' name="minutes" placeholder="Minutes" value={this.state.formData.minutes} onChange={this.handleSetState} />
                                        <input type="number" className='form-control mb-3' name="price" placeholder={`Price (${this.state.companyFormData.currency})`} value={this.state.formData.price} onChange={this.handleSetState} />
                                        <textarea name="note" className="form-control" placeholder="Description" value={this.state.formData.note} onChange={this.handleSetState}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => this.setState({ type: { title: '', name: '', action: '', id: '0' }, formData: { title: '', note: '', hours: '', price: '' } })} data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Save changes</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}
