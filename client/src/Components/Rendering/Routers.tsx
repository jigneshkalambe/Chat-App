import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "../HomePage/Home";
import Layout from "./Layout";

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
                </Switch>
            </>
        );
    }
}

export default Routers;
