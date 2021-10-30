import React, { Component } from 'react'

export default class AddDemoLessons extends Component {
    constructor(props) {
        super(props)
        this.state = { dataEdit: this.props.edit };
    }
    render() {
        return (
            <div class="modal fade bd-example-modal-lg" id="exampleModal" data-edit={this.state.dataEdit} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">{(this.state.dataEdit) ? 'Edit' : 'Add new'} group</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="row">
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label">
                                                Office:
                                            </label>
                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option>-- Office --</option>\
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label text-sm-center">
                                                Status:
                                            </label>
                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option>Actual</option>
                                                    <option>Complete</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label">
                                                Language:
                                            </label>
                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option>English</option>\
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label text-sm-center">
                                                Level:
                                            </label>
                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option value="">-- Level --</option>
                                                    <option value="2">All</option>
                                                    <option value="2">Beginner</option>
                                                    <option value="1">Elementary</option>
                                                    <option value="4">Intermediate</option>
                                                    <option value="5">Upper-intermediate</option>
                                                    <option value="3">Pre-intermediate</option>
                                                    <option value="6">Advanced</option>
                                                    <option value="9">Base</option>
                                                    <option value="27">Elementary</option>
                                                    <option value="16">Middle</option>
                                                    <option value="15">Advanced</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label">
                                            Teachers:

                                            </label>
                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option value="">-- Teachers --</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label text-sm-center">
                                            Type:
                                            </label>
                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option value="">-- Type --</option>
                                                    <option value="1">General</option>
                                                    <option value="2">Business</option>
                                                    <option value="3">Intensive</option>
                                                    <option value="16">USE / OGE</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label">
                                            Default price:
                                            </label>
                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option value="">-- Price --</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label text-sm-center">
                                            Assignee:
                                            </label>
                                            <div className="col-sm-8">
                                                <select className="form-control">
                                                    <option value="">-- Assignee --</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label">
                                            Student:
                                            </label>
                                            <div className="col-sm-8">
                                                <input list="students" className="form-control" />
                                                <datalist id="students">
                                                    <option>Student1</option>
                                                </datalist>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row form-group ">
                                            <label className="col-sm-4 col-form-label text-sm-center">
                                            Month:
                                            </label>
                                            <div className="col-sm-8">
                                                <input type="number" min="0" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
