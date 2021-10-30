import React, { Component } from 'react'

export default class HomeWork extends Component {
    render() {
        return (
            <>
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-12">
                            <h4>Home work</h4>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12">
                            <div className="table-responsive bg-white m-0 p-3 rounded shadow">
                                <table class="table table-bordered m-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Language</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Age Category</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Status</th>
                                            <th scope="col"></th>
                                            {/* <th scope="col"><button className="btn Btn32 text-danger"><i class="fas fa-trash"></i></button></th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                            New English File Elementary
                                            </td>
                                            <td>
                                            1/22/2021
                                            </td>
                                            <td>Smit D.</td>
                                            <td>Caspian</td>
                                            <td>Level Elementary</td>
                                            <td>Actual</td>
                                            <td className="btnTD text-center">
                                                <p className="m-0 p-0"><button className="btn Btn32 btn-warning mx-1"><i className="fas fa-pencil-alt"></i></button></p>
                                                <p className="m-0 p-0"><button className="btn Btn32 btn-info"><i className="far fa-eye"></i></button></p>
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
            {/* <AddBook /> */}
            </>
        )
    }
}
