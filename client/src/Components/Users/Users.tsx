import React, { Component } from "react";
import "./Users.css";
import { Avatar, Typography } from "@mui/material";

interface userData {
    _id: string;
    photoName: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    age: string;
    number: string;
    location: string;
    bio: string;
    subtitle: string;
}

interface onlineState {
    online: string;
}

interface UsersProps {
    user: userData;
    onlineState: onlineState[];
}

export class Users extends Component<UsersProps> {
    render() {
        const isOnline = this.props.onlineState.some((id) => (id as unknown) === this.props.user._id);
        return (
            <div className="Users">
                <div>
                    <Avatar src={this.props.user.photoName} sx={{ width: 50, height: 50 }} />
                </div>
                <div className="d-flex flex-column align-itmes-center gap-0 ">
                    <Typography variant="subtitle1" component={"p"}>
                        {this.props.user.firstName}
                    </Typography>
                    <Typography variant="subtitle2" component={"span"}>
                        {isOnline ? "Online" : "Offline"}
                    </Typography>
                </div>
            </div>
        );
    }
}

export default Users;
