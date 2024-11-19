import { Component } from "react";

interface ChatStates {
    isSignIn: boolean;
}

export class Controller extends Component<{}, ChatStates> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isSignIn: true,
        };
    }

    setSignIn = () => {
        this.setState({
            isSignIn: !this.state.isSignIn,
        });
    };
}

export default Controller;
