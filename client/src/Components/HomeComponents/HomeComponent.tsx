import React, { Component } from "react";
import "./HomeComponent.css";

interface homeComponet {
    children: JSX.Element | null;
}

export class HomeComponent extends Component<homeComponet> {
    render() {
        return <div className="HomeComponent">{this.props.children}</div>;
    }
    // render() {
    //     return <>{this.props.children}</>;
    // }
}

export default HomeComponent;
