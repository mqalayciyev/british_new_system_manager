import React, { Component } from 'react'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
export default class Notes extends Component {
    constructor(props) {

        super(props)

        this.state = { notes: [], data: {}, edit: 0 };

    }
    componentDidMount = () => {
        this.load()
    }
    handleFormData = event => {
        let value = event.target.value
        let name = event.target.name

        let newData = this.state.data;
        newData[name] = value

        this.setState({ data: newData })
    }

    sendForm = async (event) => {
        event.preventDefault()

        let data = this.state.data
        data['leads'] = this.props.leads
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
        if (this.state.edit === 0) {
            response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/leads-notes`, data)
        }
        else {
            response = await axios.put(`${process.env.REACT_APP_API_URL}/managers/leads-notes/${this.state.edit}`, data)
        }
        console.log(response.data)

        if (response.data.status === 'success') {
            let message  = (this.state.edit === 0) ? 'Melumat əlavə edildi.' : 'Melumat deyisdirildi.'
            NotificationManager.success(message, 'Success', 5000);
            this.load()
        }
        if (response.data.status === 'error') {
            let message = response.data.message;
            for (const [key, value] of Object.entries(message)) {
                NotificationManager.error(value, 'Error', 5000);
            }
        }

    }
    click = (e) => {
        if (e.target.classList.contains('hide-modal')) {
            this.props.removeComponent()
        }
    }
    editNote = (id, note) => {
        this.setState({
            edit: id,
            data: {note: note}
        })
    }
    deleteNote = async id => {
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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/leads-notes/${id}`)

        if (response.data.status === 'success') {
            this.load()
        }
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/leads-notes/${this.props.leads}`)

        if (response.data.status === 'success') {
            this.setState({
                notes: response.data.notes,
                delete: userInfo.user.user_info.type === 1 ? true : false
            })
        }
    }

    render() {
        return (
            <>
                <NotificationContainer />
                <div class="modal fade bd-example-modal-lg hide-modal" id="notesModal" onClick={this.click} tabindex="-1" role="dialog" aria-labelledby="notesModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg hide-modal" role="document">

                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="notesModalLabel">Leads notes</h5>
                                <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                    <span className="hide-modal" aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form onSubmit={this.sendForm}>
                                    <div class="form-group row">
                                        <div className="col-12">
                                            <input className="form-control" name="note" value={this.state.data.note} placeholder="Write note ... " onChange={this.handleFormData} />
                                        </div>
                                        <div className="col-12 mt-2 text-right">
                                            <button type="reset" onClick={() => this.setState({data: {}, edit: 0})} style={this.state.edit === 0 ? {display: 'none'} : null} className="btn btn-primary mr-2">Reset</button>
                                            <button type="submit" className="btn btn-success">Save</button>
                                        </div>

                                    </div>
                                </form>
                                <div className="form-group row">

                                    {this.state.notes.map((value, index) => {
                                        return (
                                            <div className="col-12 border rounded p-2 mb-2">
                                                <div className="row">
                                                    <div className="col-8">
                                                        <p>{value.note}</p>
                                                        <p>{value.created_at}</p>
                                                    </div>
                                                    <div className="col-4 text-right">
                                                        <button className="btn btn-warning mr-2" onClick={() => this.editNote(value.id, value.note)}><i class="fas fa-pencil-alt"></i></button>
                                                        
                                                        {
                                                            this.state.delete ? <button className="btn btn-danger" onClick={() => this.deleteNote(value.id)}><i class="fas fa-trash"></i></button> : ''
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="reset" class="btn btn-default hide-modal" data-dismiss="modal">Close</button>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        )
    }
}
