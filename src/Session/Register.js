import React, { Component } from 'react'
import {
    Link
} from "react-router-dom";
export default class Register extends Component {
    render() {
        return (
            <div class="hold-transition register-page">
                <div class="register-box">
                    <div class="card card-outline card-primary">
                        <div class="card-header text-center">
                            <Link to="/Login" class="h1"><b>Admin</b>Panel</Link>
                        </div>
                        <div class="card-body">
                            <p class="login-box-msg">Qeydiyyat keçin</p>

                            <form  method="post">
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" placeholder="Ad & Soyad" />
                                    <div class="input-group-append">
                                        <div class="input-group-text">
                                            <span class="fas fa-user"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="input-group mb-3">
                                    <input type="email" class="form-control" placeholder="Email" />
                                    <div class="input-group-append">
                                        <div class="input-group-text">
                                            <span class="fas fa-envelope"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="input-group mb-3">
                                    <input type="password" class="form-control" placeholder="Password" />
                                    <div class="input-group-append">
                                        <div class="input-group-text">
                                            <span class="fas fa-lock"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="input-group mb-3">
                                    <input type="password" class="form-control" placeholder="Parolu yenidən daxil edin" />
                                    <div class="input-group-append">
                                        <div class="input-group-text">
                                            <span class="fas fa-lock"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-8">
                                        <div class="icheck-primary">
                                            <input type="checkbox" id="agreeTerms" name="terms" value="agree" />
                                            <label for="agreeTerms">
                                                <Link to="/Register">Şərtlərlə</Link> razıyam
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <button type="submit" class="btn btn-primary btn-block">Qeydiyyat</button>
                                    </div>
                                </div>
                            </form>
                            <p class="mb-1">
                                <Link to="/Login">Artıq üzvlüyüm var</Link>
                            </p>
                            
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
