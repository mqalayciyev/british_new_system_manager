import React, { Component } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import queryString from 'query-string';
import img from '../../img/profile.jpg';
// import FileBase64 from 'react-file-base64';


export default class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = { chat: [], messageArea: [], myid: 0, userid: 0, formData: {userid: 0}, display: true};
    }
    componentDidMount = () => {
        this.load()
    }
    load = async name => {
        const pathname = window.location.pathname.split('/');
        
        let id = pathname[pathname.length-1];
        let userInfo = JSON.parse(localStorage.getItem('user-info'))

        let newFormData = this.state.formData;
        newFormData['userid'] = id

        this.setState({
            formData: newFormData
        })

        this.setState({ userid: id, myid: userInfo.user.user_info.id })
        axios.interceptors.request.use(
            config => {
                config.headers.authorization = `Bearer ${userInfo.user.token}`;
                return config;
            },
            error => {
                return Promise.reject(error)
            }
        )
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/messages/${id}`)
        
        if (response.data.status === 'success') {
            this.setState({
                chat: response.data.chat,
                user: response.data.user,
                display: false
            })
            this.messageRender();
        }

    }
    handleFormData = event => {
        let value = event.target.value
        let name = event.target.name
        
        let newFormData = this.state.formData;
        if(value === '')
        {
            delete newFormData[`${name}`];
        }
        else{
            newFormData[name] = value
        }
        this.setState({
            formData: newFormData
        })
    }
    sendForm = async (event) => {
        event.preventDefault()
        let formData = new FormData();
        if(this.state.formData.file)
            formData.append("file", this.state.formData.file)
        if(this.state.formData.userid)
            formData.append("userid", this.state.formData.userid)
        if(this.state.formData.message)
            formData.append("message", this.state.formData.message)

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
        let response= await axios.post(`${process.env.REACT_APP_API_URL}/managers/messages`, formData)
        console.log(response.data)
        if(response.data.status === 'success'){
            // NotificationManager.success('Mesaj gonderildi.', 'Success', 5000);
            this.load()
        }
        if(response.data.status === 'error'){
            let message = response.data.message;
            for (const [key, value] of Object.entries(message)) {
                console.log(key)
                NotificationManager.error(value, 'Error', 5000);
            }
        }

    }
    getFiles(event){

        let newFormData = this.state.formData;
        newFormData['file'] = event.target.files[0]
        this.setState({
            formData: newFormData
        })
    }
    deleteFile = () => {
        let newFormData = this.state.formData;
        delete newFormData.file;
        console.log(newFormData)
        this.setState({
            formData: newFormData
        })
        document.querySelector('form input[type="file"]').value = null
    }
    dateReplace = (time) => {
        let date = new Date(time)
        date = date.toString()
        date = date.split('GMT')[0]
        return date
    }
    messageRender = () => {
        let chat = []
        if(this.state.chat.length > 0){
            this.state.chat.map((value, index) => {
                if (value.sender === this.state.myid) {
                    chat.push(
                        <div className="row mt-3" align="right">
                            <div className="col-11">
                                <div className="position-relative col-12 px-3 rounded" style={{ border: '1px solid #4aa9e9' }}>
                                    <div class="TypingArrowRight"></div>
                                    <p>{this.dateReplace(value.created_at)} <b>You</b></p>
                                    <p>{value.message}</p>
                                    {
                                        (value.file_url) ? <p><i class="fas fa-paperclip"></i> <a href={`${value.file_url}/${value.file_name}`} target="_blank" download={`${value.file_url}/${value.file_name}`}>{value.file_name}</a></p> : null
                                    }
                                </div>
                            </div>
                            <div className="col">
                                <img className="rounded-circle w-100" style={{ maxWidth: '80px', maxHeight: '80px' }}  src={value.user1_image ? process.env.REACT_APP_URL + '/' + value.user1_image : img} />
                            </div>
                        </div>
                    )
                }
                else {
                    chat.push(
                        <div className="row mt-3">
                            <div className="col">
                                <img className="rounded-circle w-100" style={{ maxWidth: '80px', maxHeight: '80px' }} src={value.user1_image ?  process.env.REACT_APP_URL + '/' + value.user1_image : img} />
                            </div>
                            <div className="col-11">
                                <div className="position-relative col-12 px-3 rounded" style={{ border: '1px solid #20C997FF' }}>
                                    <div class="TypingArrowLeft"></div>
                                    <p><Link to={`/User?user=${value.user1_id}`}>{value.user_1}</Link> {this.dateReplace(value.created_at)}</p>
                                    <p>{value.message}</p>
                                    {
                                        (value.file_url) ? <p><i class="fas fa-paperclip"></i> <a href={`${value.file_url}/${value.file_name}`} target="_blank" download={`${value.file_url}/${value.file_name}`}>{value.file_name}</a></p> : null
                                    }

                                </div>
                            </div>
                        </div>
                    )
                }
            })
        }
        this.setState({
            messageArea: chat
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
                            <h4>{this.state.user && this.state.user.name}</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <form onSubmit={this.sendForm}>
                                <textarea className="form-control" name="message" rows="3" onChange={this.handleFormData}></textarea>
                                <div className="row mt-2">
                                    <div className="col-sm-6">
                                        <span className="pr-3 text-danger" style={{cursor: 'pointer'}} onClick={this.deleteFile}><i class="fas fa-times"></i> Delete file</span>
                                        <input type="file" onChange={this.getFiles.bind(this)} />
                                       {/* <FileBase64
                                            multiple={ false }
                                            onDone={ this.getFiles.bind(this) } /> */}
                                    </div>
                                    <div className="col-sm-6 text-right">
                                        <button button="submit" className="btn btn-success">Send</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-12">
                        <div className="loading" style={{ display: this.state.display ? 'block' : 'none', top: '15px' }}>
                            <div className="text-center">
                                <span>
                                    Loading...
                                </span>
                            </div>
                        </div>
                            <div className="col-12 p-3 bg-white pb-4 message-area">
                                {
                                    this.state.messageArea.length > 0 ? this.state.messageArea.map((value, index) => {
                                        return value
                                    }) : <div className=""><h3 className="text-center m-0">No message <i class="far fa-frown"></i></h3></div>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}
