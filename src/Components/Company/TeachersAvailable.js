import React, { Component } from 'react'
import img from '../../img/profile.jpg';

export default class TeachersAvailable extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-12">
                            <h4>Teachers available</h4>
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
                                            <th scope="col"></th>
                                            <th scope="col">Full name</th>
                                            <th scope="col">Lesson</th>
                                            <th scope="col">Level</th>
                                            <th scope="col">Age categories</th>
                                            <th scope="col">Offices</th>
                                            <th scope="col">Rating</th>
                                            <th scope="col">Description</th>
                                            <th scope="col"></th>
                                            {/* <th scope="col"><button className="btn Btn32 text-danger"><i class="fas fa-trash"></i></button></th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                            <img className="rounded-circle" style={{width: '100px', height: '100px'}} src={img} alt='account' />
                                            </td>
                                            <td>
                                            Bisnak Roland
                                            </td>
                                            <td>English</td>
                                            <td>Beginer</td>
                                            <td>Youngs</td>
                                            <td>Caspian</td>
                                            <td>150</td>
                                            <td>Description</td>
                                            <td className="btnTD text-center">
                                                <button className="btn Btn32 btn-primary"><i className="fas fa-calendar-alt"></i></button>
                                            </td>
                                            {/* <th scope="row" className="text-center"><input type="checkbox" name="checkbox" /></th> */}
                                        </tr>
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
