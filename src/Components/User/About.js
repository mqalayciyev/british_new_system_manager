import React, { Component } from 'react'

import SweetAlert from 'react-bootstrap-sweetalert';

import img from '../../img/profile.jpg';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import '../../CSS/style.css';
import { SessionContext } from "../../Context/Session";








// const $ = window.$;



export default class About extends Component {
    static contextType = SessionContext;
    constructor(props) {
        super(props);
        this.state = {
            status: ['Passive', 'Active', 'Left his job', 'On vacation', 'Was fired', 'Is engaged in', 'Graduated from training', 'Will continue',],
            
            
        }
    }
    componentDidMount = () => {
        this.setState({
            // img: this.props.user ? this.props.user.image : null,
            user: this.props.user ? this.props.user : null
        })
    }



    date(value) {
        let date = value.split('-')
        return `${date[2]}/${date[1]}/${date[0]}`
    }



    render() {

        return (
            <>
                <NotificationContainer />
                <div className="col-lg-3 float-left">
                    <div className="row">
                        <div className="card col-12">
                            <div className="card-header">
                                <div className="row justify-content-center profile_image">
                                    <img src={this.props.user && this.props.user.image ? process.env.REACT_APP_URL + '/' +this.props.user.image : img} style={{ width: '150px', height: '150px' }} className="rounded-circle" alt="user" />
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <label className="col-12">Main info</label>
                                </div>
                                <div className="row">
                                    <p className="col-12 m-0">Status</p>
                                    <p className="col-12"><a href="#" onClick={(e) => e.preventDefault()} className="Dashed">{this.props.user ? this.state.status[this.props.user.status] : `[No]`}</a></p>
                                </div>
                                <div className="row">
                                    <p className="col-12 m-0">Age</p>
                                    <p className="col-12">{this.props.user ? this.date(this.props.user.date) : ''}</p>
                                </div>
                                <div className="row">
                                    <p className="col-12 m-0">Office</p>
                                    <p className="col-12">{this.props.user ? this.props.user.office_name : ''}</p>
                                </div>
                                <div className="row">
                                    <p className="col-12 m-0">Email</p>
                                    <p className="col-12">{this.props.user ? this.props.user.email : ''}</p>
                                </div>
                                <div className="row">
                                    <p className="col-12 m-0">Mobile</p>
                                    <p className="col-12">{this.props.user ? this.props.user.mobile : ''}</p>
                                </div>
                                <div className="row">
                                    <p className="col-12 m-0">Phone</p>
                                    <p className="col-12">{this.props.user ? this.props.user.phone : ''}</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
