import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../HomePage/Home";
import Layout from "./Layout";

export class Routers extends Component {
    render() {
        return (
            <>
                <Routes>
                    <Route path="/" index element={<Layout />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </>
        );
    }
}

export default Routers;
