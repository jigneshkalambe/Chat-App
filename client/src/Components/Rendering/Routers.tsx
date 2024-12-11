import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "../HomePage/Home";
import Layout from "./Layout";
import OtpVerification from "../OTP/OtpVerification";

export class Routers extends Component {
    render() {
        const userId = localStorage.getItem("userId");
        return (
            <>
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={() => {
                            return userId ? <Redirect to={"/home"} /> : <Layout />;
                        }}
                    />
                    <Route
                        path="/home"
                        render={() => {
                            return userId ? <Home /> : <Redirect to={"/"} />;
                        }}
                    />
                    <Route path="/verifyEmail" component={OtpVerification} />
                </Switch>
            </>
        );
    }
}

export default Routers;
