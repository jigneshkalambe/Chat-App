import React, { Component } from "react";
import "./Users.css";
import { Avatar, Badge, Box, Button, styled, Typography } from "@mui/material";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import { Socket } from "socket.io-client";

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
    pendingMsgCount: number;
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
    socket: Socket;
}

interface UsersState {
    isTyping: boolean;
}

export class Users extends Component<UsersProps, UsersState> {
    constructor(props: UsersProps) {
        super(props);
        this.state = { isTyping: false };
    }

    componentDidMount() {
        this.props.socket.on("userTyping", ({ senderId }) => {
            if (senderId === this.props.user._id) {
                this.setState({ isTyping: true });
            }
        });

        this.props.socket.on("userStoppedTyping", ({ senderId }) => {
            if (senderId === this.props.user._id) {
                this.setState({ isTyping: false });
            }
        });
    }

    componentWillUnmount() {
        this.props.socket.off("userTyping");
        this.props.socket.off("userStoppedTyping");
    }

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
                        <Typography variant="subtitle1" component="p" sx={{ fontWeight: 500 }} className="user-name">
                            {`${this.props.user.firstName} ${this.props.user.lastName}`}
                        </Typography>
                        <Typography variant="subtitle2" component="span" className={`user-status ${isOnline ? "online" : "offline"}`}>
                            {isOnline ? (this.state.isTyping ? "Typing..." : "Online") : "Offline"}
                        </Typography>
                    </div>
                </div>
                <Box sx={{ width: 40, height: 40, minWidth: 40, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button
                        variant="outlined"
                        sx={{ color: "red", borderColor: "red", display: "flex", justifyContent: "center", alignItems: "center", width: 40, height: 40, borderRadius: 50, minWidth: 0, padding: 0 }}
                        onClick={this.deleteHandler}
                        aria-label="delete"
                        className="delete-icon-button"
                    >
                        <DeleteOutlineOutlined className="deleteIcon" />
                    </Button>
                    <Badge color="warning" badgeContent={this.props.user.pendingMsgCount} className="BadgeCount" />
                </Box>
            </div>
        );
    }
}

export default Users;
