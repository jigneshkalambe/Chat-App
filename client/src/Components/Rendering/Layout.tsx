import { Box, Button, Card, Container } from "@mui/material";
import React, { Component } from "react";
import SignUp from "../Sign_Up/SignUp";
import SignIn from "../Sign_In/SignIn";
import Controller from "../Controller";
import "./Layout.css";

export class Layout extends Controller {
    render() {
        return (
            <Container>
                <>{this.state.isSignIn === false ? <SignUp isSignIn={this.state.isSignIn} setSignIn={this.setSignIn} /> : <SignIn isSignIn={this.state.isSignIn} setSignIn={this.setSignIn} />}</>
            </Container>
        );
    }
}

export default Layout;
