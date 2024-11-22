import React, { Component } from "react";
import "./App.css";
import Layout from "./Components/Rendering/Layout";
import Routers from "./Components/Rendering/Routers";

export class App extends Component {
    render() {
        return (
            <>
                {/* <Layout /> */}
                <Routers />
            </>
        );
    }
}

export default App;
