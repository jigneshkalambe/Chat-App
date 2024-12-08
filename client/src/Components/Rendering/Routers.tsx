import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../HomePage/Home";
import Layout from "./Layout";

export class Routers extends Component {
    render() {
        return (
            <>
                <Switch>
                    <Route exact path="/" component={Layout} />
                    <Route path="/home" component={Home} />
                </Switch>
            </>
        );
    }
}

export default Routers;
