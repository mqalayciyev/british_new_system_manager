import React, { Component } from 'react'
import { Accordion, Card, Button } from 'react-bootstrap'
export default class History extends Component {
    constructor(props) {
        super(props)
        this.state = {
            body: false,
        }
    }
    render() {
        return (
            <div style={{ display: 'flex', minWidth: '16px'}}>
                <Accordion className="col-sm-12 px-3">
                    <Card style={{borderRadius: '4px 4px 0px 0px'}}>
                        <Card.Header className="card-header bg-primary clearfix text-white" >
                            <Accordion.Toggle as={Button} variant="link" eventKey="1" className="text-white clearfix w-100 text-left" onClick={() => this.setState({ body: !this.state.body })}>
                                History
                                <span className="float-right"  style={{ cursor: 'pointer', userSelect: 'none' }}><i class={(this.state.body) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'}></i></span>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                <div className="table-responsive bg-white m-0 p-3 rounded shadow">
                                    <table class="table table-bordered m-0">
                                        <thead>
                                            <tr>
                                                <th scope="col">Date</th>
                                                <th scope="col">Action</th>
                                                <th scope="col">Description</th>
                                                <th scope="col"></th>
                                                {/* <th scope="col"><button className="btn Btn32 text-danger"><i class="fas fa-trash"></i></button></th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                2/5/2021
Overdue
                                                </td>
                                                <td>
                                                Created by student --- I.
                                                </td>
                                                <td>
                                                Joined to the group English day
                                                </td>
                                                <td className="btnTD">
                                                    <button className="btn Btn32 btn-warning" data-toggle="modal" data-target="#exampleModal" onClick={() => this.setState({edit: 1})}><i class="fas fa-pencil-alt"></i></button>
                                                </td>
                                                {/* <th scope="row" className="text-center"><input type="checkbox" name="checkbox" /></th> */}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
        )
    }
}
