import React from 'react';
import About from './About';
import axios from 'axios';


class Profile extends React.Component {
    constructor (props){
        super(props)
        this.state = {
            // user: [],
            display: true
        }
    }
    componentDidMount = () => {
        console.log()
        let id = this.props.match.params.id
        this.load(id)
    }
    load = async (id) => {
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
        let response = await axios.get(`${process.env.REACT_APP_API_URL}/managers/users/${id}`)
        if (response.data.status === 'success') {
            this.setState({
                user: response.data.user,
                display: false
            })
            console.log(this.state.user)
        }
        

    }
    render() {
        
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6">
                                <h5>{`${this.state.user ? this.state.user.first_name : 'First Name'} ${this.state.user ? this.state.user.last_name : 'Last Name'}`}</h5>
                            </div>
                        </div>
                        <div className="d-block clearfix mt-3">
                        <div className="loading" style={{ display: this.state.display ? 'block' : 'none' }}>
                            <div className="text-center">
                                <span>
                                    Loading...
                                </span>
                            </div>
                        </div>
                            <About user={this.state.user} />
                            {/* <Tasks /> */}
                            {/* <History /> */}
                            {/* <Payment /> */}
                        </div>
                    </div>
                </div>
                {/* <Edit user={this.state.user} office={this.state.office}/> */}
            </>
        );

    }
}

export default Profile;