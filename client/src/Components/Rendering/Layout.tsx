import { Container } from "@mui/material";
import React from "react";
import SignUp from "../Sign_Up/SignUp";
import SignIn from "../Sign_In/SignIn";
import Controller from "../Controller";
import "./Layout.css";

export class Layout extends Controller {
    render() {
        return (
            <div className="layoutContainer">
                <>
                    {this.state.isSignIn === false ? (
                        <SignUp
                            isSignIn={this.state.isSignIn}
                            setSignIn={this.setSignIn}
                            getData={this.getData}
                            formData={this.state.formData}
                            submitDataHandler={this.submitDataHandler}
                            handleUploadClick={this.handleUploadClick}
                            handleFileChange={this.handleFileChange}
                            photoLink={this.state.photoLink}
                        />
                    ) : (
                        <SignIn
                            isSignIn={this.state.isSignIn}
                            setSignIn={this.setSignIn}
                            getData={this.getData}
                            formData={this.state.formData}
                            submitDataHandler={this.submitDataHandler}
                            loginData={this.state.loginData}
                            loginAccount={this.loginAccount}
                            getLoginData={this.getLoginData}
                        />
                    )}
                </>
            </div>
        );
    }
}

export default Layout;
