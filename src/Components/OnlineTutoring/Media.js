import React, { Component } from 'react'
import UploadMedia from './Modals/UploadMedia'
import axios from 'axios';
import audio from '../../img/audio-100x100.png';
import book from '../../img/books-1024x1024.jpg';
import video from '../../img/vimeo-play-button-png.png';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class PrivateLessons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            media: [],
            type: {'audio': audio, 'video': video, 'book': book},
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/media`)
        if (response.data.status === 'success') {
            this.setState({
                media: response.data.media,
                delete: userInfo.user.user_info.type === 1 ? true : false,
                display: false
            })
        }


    }
    capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    removeComponent = () => {
        this.setState({
            modal: []
        })
    }
    addComponent = (value, type) => {
        let edit = 0
        let data = {}
        if (value) {
            edit = value.id
            data = value
        }

        let modal = <UploadMedia edit={edit} data={data} type={type} removeComponent={this.removeComponent} load={this.load} />

        this.setState({
            modal: modal
        })
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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/media/${id}`)


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
                                <h4>Media</h4>
                            </div>
                            <div className="col-12 col-sm-6 clearfix">
                                <button type="button" class="btn btn-info  float-right" data-toggle="modal" data-target="#uploadMediaModal" onClick={() => this.addComponent('', 'image')}>Upload image</button>
                                <button type="button" class="btn btn-info  float-right mr-2" data-toggle="modal" data-target="#uploadMediaModal" onClick={() => this.addComponent('', 'audio')}>Upload audio</button>
                                <button type="button" class="btn btn-info  float-right mr-2" data-toggle="modal" data-target="#uploadMediaModal" onClick={() => this.addComponent('', 'video')}>Upload video</button>
                                <button type="button" class="btn btn-info  float-right mr-2" data-toggle="modal" data-target="#uploadMediaModal" onClick={() => this.addComponent('', 'book')}>Upload book</button>
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
                                                <th scope="col">Type</th>
                                                <th scope="col">Added by</th>
                                                <th scope="col">Description</th>
                                                <th scope="col"></th>
                                                {/* <th scope="col"><button className="btn Btn32 text-danger"><i class="fas fa-trash"></i></button></th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.media.length > 0 ? this.state.media.map((value, index) => {
                                                let CustomTag;
                                                
                                                if(value.type === 'image'){
                                                    CustomTag = `img`
                                                }
                                                else {
                                                    CustomTag = `a`
                                                }
                                                return (
                                                    <tr key={index}>
                                                    <td className="text-center">
                                                            <CustomTag style={{ width: "30vw", minWidth: "50px", maxWidth: "150px" }} src={value.file}  />
                                                            {value.type === 'image' ? '' : <><p><img className="w-100" style={{ maxWidth: '80px' }} src={this.state.type[value.type]} alt='media' /></p> <p><a href={value.file} target="_blank" rel="noreferrer">{value.title}</a></p></>}
                                                        </td>
                                                        <td>
                                                            {value.type}
                                                        </td>
                                                        <td>
                                                            {value.user_name}
                                                        </td>
                                                        <td>
                                                            {value.note}
                                                        </td>
                                                        <td className="btnTD text-center">
                                                            <p className="m-0 p-0"><button className="btn Btn32 btn-warning mx-1" data-toggle="modal" data-target={`#uploadMediaModal`} onClick={() => this.addComponent(value, value.type)}><i className="fas fa-pencil-alt"></i></button></p>
                                                            <p className="m-0 p-0"><button className="btn Btn32 btn-info"><i className="far fa-eye"></i></button></p>
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
