import React, { Component } from 'react'
import AddQuestion from './AddQuestion'
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export default class Questions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            add: [],
            questions: []
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/questions/${this.props.id}`)
        if (response.data.status === 'success') {
            console.log(response.data)
            this.setState({
                questions: response.data.questions
            })
        }


    }
    click = (e) => {
        if (e.target.classList.contains('hide-modal')) {
            this.props.removeComponent()
        }
    }
    removeComponent = () => {
        document.getElementById('questionsModal').style.overflow = 'auto'
        this.setState({
            add: []
        })
    }
    addQuestionComponent = (data, test_id) => {
        let add = <AddQuestion test_id={test_id} edit={data.id ? data.id : 0} data={data} removeComponent={this.removeComponent} load={this.load} />
        this.setState({
            add: add
        })
    }
    deleteQuestionComponent = async (id) => {
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
        let response = await axios.delete(`${process.env.REACT_APP_API_URL}/managers/questions/${id}`)
        console.log(response.data)

        if (response.data.status === 'success') {
            NotificationManager.warning('Sual silindi.', 'Warning', 5000);
            this.load()
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
                <div class="modal fade hide-modal bd-example-modal-lg" id="questionsModal" onClick={this.click} tabindex="-1" role="dialog" aria-labelledby="questionsModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg hide-modal" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button id="questionsModalLabel" className="btn btn-success modal-title" data-toggle="modal" data-target="#addQuestionModal" onClick={() => this.addQuestionComponent({}, this.props.id)}>Add Question <i class="fas fa-plus"></i></button>
                                <button type="button" class="close hide-modal" data-dismiss="modal" aria-label="Close">
                                    <span className="hide-modal" aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">

                                <div class="accordion" id="accordionPanelsStayOpenExample">
                                    {this.state.questions.length > 0 ? this.state.questions.map((value, index) => {
                                        let data = value
                                        
                                        const answers = JSON.parse(value.answers)
                                        for(let i = 0; i<answers.length; i++){
                                            data[answers[i].answer_title] = answers[i].answer
                                        }
                                        return (
                                            <div class="card" key={index}>
                                                <div class="card-header bg-secondary">
                                                    <div className="row justify-content-between align-items-center">
                                                        <span>{value.question}</span>
                                                        <div>
                                                            <button id="questionsModalLabel" className="btn btn-success modal-title ml-auto mr-2" data-toggle="modal" data-target="#addQuestionModal" onClick={() => this.addQuestionComponent(data, this.props.id)}>Edit Question <i class="fas fa-plus"></i></button>
                                                            <button className="btn btn-danger ml-auto" onClick={() => this.deleteQuestionComponent(data.id)}><i class="fas fa-trash"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ul class="list-group list-group-flush">
                                                    {
                                                        answers.map((v, i) => {
                                                            return (
                                                                <li key={i} class="list-group-item">{v.true ? <i class="fas fa-check text-success"></i> :<i class="fas fa-times text-danger"></i>} {v.answer}</li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        )
                                    }) : <h4 className="text-center">Empty</h4>
                                    }
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary hide-modal" data-dismiss="modal">Close</button>
                                {/* <button type="button" class="btn btn-primary">Save changes</button> */}
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.add
                }
            </>

        )
    }
}
