import React, { Component } from "react";
import "./Users.css";
import { Avatar, Badge, Box, IconButton, styled, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface UserData {
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

interface OnlineState {
    online: string;
}

interface UsersProps {
    user: UserData;
    onlineState: OnlineState[];
    activeUserId: string;
    deleteNewUserList: (user: UserData) => void;
    selectUserHandler: (user: UserData) => void;
}

export class Users extends Component<UsersProps> {
    deleteHandler = () => {
        this.props.deleteNewUserList(this.props.user);
    };

    dataSelectHandler = (user: UserData) => {
        this.props.selectUserHandler(user);
    };

    render() {
        const StyledBadge = styled(Badge)(({ theme }) => ({
            "& .MuiBadge-badge": {
                backgroundColor: "#44b700",
                color: "#44b700",
                boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                "&::after": {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    animation: "ripple 1.2s infinite ease-in-out",
                    border: "1px solid currentColor",
                    content: '""',
                },
            },
            "@keyframes ripple": {
                "0%": {
                    transform: "scale(.8)",
                    opacity: 1,
                },
                "100%": {
                    transform: "scale(2.4)",
                    opacity: 0,
                },
            },
        }));

        const isOnline = this.props.onlineState.some((id) => (id as unknown) === this.props.user._id);
        return (
            <div className={`Users ${this.props.activeUserId === this.props.user._id ? "active-user" : ""}`}>
                <div className="user-info" onClick={() => this.dataSelectHandler(this.props.user)}>
                    <div className="avatar-container">
                        <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant={isOnline ? "dot" : "standard"}>
                            <Avatar
                                alt={`${this.props.user.firstName} ${this.props.user.lastName}`}
                                src={this.props.user.photoName}
                                sx={{
                                    width: 50,
                                    height: 50,
                                    border: "1px solid #ccc",
                                    transition: "transform 0.3s ease",
                                }}
                                className="user-avatar"
                            />
                        </StyledBadge>
                    </div>
                    <div className="user-details">
                        <Typography variant="subtitle1" component="p" className="user-name">
                            {`${this.props.user.firstName} ${this.props.user.lastName}`}
                        </Typography>
                        <Typography variant="subtitle2" component="span" className={`user-status ${isOnline ? "online" : "offline"}`}>
                            {isOnline ? "Online" : "Offline"}
                        </Typography>
                    </div>
                </div>
                <Box className="delete-icon-container">
                    <IconButton onClick={this.deleteHandler} aria-label="delete" className="delete-icon-button">
                        <DeleteIcon className="deleteIcon" color="error" />
                    </IconButton>
                </Box>
            </div>
        );
    }
}

export default Users;
