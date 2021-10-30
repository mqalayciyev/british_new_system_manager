import React, { Component } from 'react'
import {
    Link
} from "react-router-dom";
export default class RecoveryPassword extends Component {
    render() {
        return (
            <div class="hold-transition login-page">
                <div class="login-box">
                    <div class="card card-outline card-primary">
                        <div class="card-header text-center">
                            <Link to="/Login" class="h1"><b>Admin</b>Panel</Link>
                        </div>
                        <div class="card-body">
                            <p class="login-box-msg">Yeni parolunuzdan yalnız bir addımsınız, parolunuzu indi bərpa edin.</p>
                            <form method="post">
                                <div class="input-group mb-3">
                                    <input type="password" class="form-control" placeholder="Password" />
                                    <div class="input-group-append">
                                        <div class="input-group-text">
                                            <span class="fas fa-lock"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="input-group mb-3">
                                    <input type="password" class="form-control" placeholder="Şifrəni təsdiq edin" />
                                    <div class="input-group-append">
                                        <div class="input-group-text">
                                            <span class="fas fa-lock"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <button type="submit" class="btn btn-primary btn-block">Parolu dəyişdirin</button>
                                    </div>
                                </div>
                            </form>

                            <p class="mt-3 mb-1">
                                <Link to="/Login">Giriş</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
