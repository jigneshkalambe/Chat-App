import React, { Component } from "react";
import "./App.css";
import Routers from "./Components/Rendering/Routers";
import "react-toastify/dist/ReactToastify.css";
import { Slide, ToastContainer } from "react-toastify";

export class App extends Component {
    render() {
        return (
            <>
                <Routers />
                <ToastContainer
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    closeOnClick={true}
                    pauseOnHover={true}
                    draggable={true}
                    theme="light"
                    transition={Slide}
                    newestOnTop
                />
            </>
        );
    }
}

export default App;
