import React, { Component } from 'react'
import axios from 'axios';
export default class Teachers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            evaluation: [],
            display: true
        };
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/evaluations`)
        if(response.data.status === 'success'){
            this.setState({
                evaluation: response.data.evaluation,
                display: false
            })
        }
        
    }
    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-12">
                            <h4>Evaluation</h4>
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
                                            <th scope="col">Teacher</th>
                                            <th scope="col">Evaluation date</th>
                                            <th scope="col">Student</th>
                                            <th scope="col">Office</th>
                                            <th scope="col">Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.evaluation.length > 0 ? this.state.evaluation.map((value, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                {value.teacher_name}
                                                            </td>
                                                            <td>
                                                                {value.created_at}
                                                            </td>
                                                            <td>
                                                                {value.student_name}
                                                            </td>
                                                            <td>
                                                                
                                                                {value.office_name}
                                                            </td>
                                                            <td>
                                                                {value.note}
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
        )
    }
}
