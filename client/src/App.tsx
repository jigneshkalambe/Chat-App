import React, { Component } from "react";
import "./App.css";
import Routers from "./Components/Rendering/Routers";
import { Slide, ToastContainer } from "react-toastify";

export class App extends Component {
    render() {
        return (
            <>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick={true} pauseOnHover={true} draggable={true} theme="light" transition={Slide} />
                <Routers />
            </>
        );
    }
}

export default App;
