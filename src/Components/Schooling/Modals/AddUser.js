import React, { Component } from 'react'
import Select from 'react-select';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class AddUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            students: [],
            selectedStudents: []
        };
    }
    click = (e) => {
        if (e.target.classList.contains('hide-modal')) {
            this.props.removeComponent()
        }
    }
    changeStudents = selectedOption => {

        this.setState({
            selectedStudents: selectedOption
        })
    };
    componentDidMount = async () => {
        let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/group/get-students/${this.props.group}`)
        if (response.data.status === 'success') {
            let array1 = []
            let array2 = []
            if (response.data.students.length > 0) {
                response.data.students.forEach(element => {
                    array1.push({ value: element.id, label: element.user_name })
                });
            }
            if (response.data.selectedStudents.length > 0) {
                response.data.selectedStudents.forEach(element => {
                    array2.push({ value: element.id, label: element.user_name })
                });
            }
            
            this.setState({
                students: array1,
                selectedStudents: array2
                
            })
        }
    }
    sendForm = async (event) => {
        event.preventDefault()

        let data = {'selectedStudents': this.state.selectedStudents}
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
        let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/group/add-students/${this.props.group}`, data)
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
                <div class="modal fade hide-modal" id="addModal" tabindex="-1" onClick={this.click} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <form onSubmit={this.sendForm}>
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Add User</h5>
                                    <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                        <span className="hide-modal" aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div className="row form-group ">
                                        <label className="col-sm-4 col-form-label text-sm-center">
                                            Students:
                                            </label>
                                        <div className="col-sm-8">
                                            <Select
                                                isMulti
                                                value={this.state.selectedStudents}
                                                name="study_days"
                                                options={this.state.students}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                onChange={this.changeStudents}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <button type="reset" class="btn btn-secondary hide-modal" data-dismiss="modal">Close</button>
                                    <button type="submit" class="btn btn-primary">Save changes</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}
