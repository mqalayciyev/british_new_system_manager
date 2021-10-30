import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { SessionContext } from "../../Context/Session";

import "croppie/croppie.css";
// import { Button, Grid } from "@material-ui/core"
import Croppie from "croppie";




class ImageUpload extends React.Component {
    static contextType = SessionContext;

    constructor(props) {
        super(props);
        // const userInfo = localStorage.getItem('user-info')
        // const user = JSON.parse(userInfo)

        


        this.state = {
            croppie: null,
            image: '',
            delete: false,
        }
    }

    componentDidMount = () => {

        var c = new Croppie(document.getElementById('image-helper'), {
            viewport: {
                width: 400,
                height: 400,
                type: 'square'
            },
            boundary: {
                width: 410,
                height: 410,
            }
        });

        this.setState({ croppie: c })
    }
    handleImage = (event) => {
        let image = URL.createObjectURL(event.target.files[0])
        this.setState({ image })
        let c = this.state.croppie;
        c.bind({
            url: image,
        });
        this.setState({ croppie: c })
    }
    onConfirm = async (link, file) => {

        const userInfo = JSON.parse(localStorage.getItem('user-info'))
        axios.interceptors.request.use(
            config => {
                config.headers.authorization = `Bearer ${userInfo.user.token}`;
                return config;
            },
            error => {
                return Promise.reject(error)
            }
        )

        let formData = new FormData();
        formData.append("file", file)

        formData.append("id", userInfo.user.user_id)

        let response = await axios.post(`${process.env.REACT_APP_API_URL}/managers/manager/${link}`, formData)


        if (response.data.status === 'success') {
            NotificationManager.success('Məlumatlar dəyişdirildi.', 'Success', 5000);
            if (response.data.user) {
                userInfo['user']['user_info'] = response.data.user;
                localStorage.setItem('user-info', JSON.stringify(userInfo))
                this.context.setSession(response.data.status, userInfo)
                this.props.setImage(response.data.image)
            }
        }
        if (response.data.status === 'error') {
            let message = response.data.message;
            for (const [key, value] of Object.entries(message)) {
                NotificationManager.error(value, 'Error', 5000);
            }

        }
    }
    handleSubmit = (event) => {
        event.preventDefault()
        if (this.state.croppie !== null) {
            this.state.croppie.result({
                type: 'blob',
                size: {
                    width: 500,
                    height: 500
                }
            }).then((blob) => {
                this.onConfirm('add_image', blob)
            }
            )
        }
    }
    onCancel = () => {
        let c = this.state.croppie;
        c.bind({
            url: '',
        });
        this.setState({ croppie: c })
        this.setState({ image: '' })
    }
    render() {
        return (
            <>
                <NotificationContainer />
                <div class="modal fade bd-example-modal-lg" id="imageUpload" tabindex="-1" role="dialog" aria-labelledby="imageUploadLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <form onSubmit={this.handleSubmit}>
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="imageUploadLabel">Edit</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div id="image-helper"></div>
                                    <input type="file" accept="image/*" onChange={this.handleImage} id="cover_image"></input>
                                </div>
                                <div class="modal-footer">
                                    <button type="reset" class="btn btn-secondary" data-dismiss="modal" onClick={this.onCancel}>Close</button>
                                    <button type="submit" class="btn btn-primary">Save changes</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </>

        );
    }
}

export default ImageUpload;