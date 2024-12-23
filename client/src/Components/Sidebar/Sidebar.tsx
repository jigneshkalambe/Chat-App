import React, { Component } from "react";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import "./Sidebar.css";
import { Typography } from "@mui/material";

interface sidebarProps {
    componentRender: (val: string) => void;
    components: string;
    friendRequestListCount: number;
}

export class Sidebar extends Component<sidebarProps, {}> {
    handlerComponent = (Name: string) => {
        this.props.componentRender(Name);
    };

    render() {
        return (
            <div className="SideBar">
                <div className="Sidebar_header">
                    <div className="header_icon">
                        <QuestionAnswerOutlinedIcon />
                    </div>
                    <div className="header_text">
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Chat App
                        </Typography>
                    </div>
                </div>
                <div className="Sidebar_Body">
                    <div className="Sidebar_Body_row">
                        <div className={`Sidebar_section ${this.props.components === "Profile" ? "activeComponent" : ""}`} onClick={() => this.handlerComponent("Profile")}>
                            <div className="header_icon">
                                <PersonOutlinedIcon />
                            </div>
                            <div className="header_text">
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Profile
                                </Typography>
                            </div>
                        </div>

                        <div className={`Sidebar_section ${this.props.components === "Chats" ? "activeComponent" : ""}`} onClick={() => this.handlerComponent("Chats")}>
                            <div className="header_icon">
                                <SendOutlinedIcon />
                            </div>
                            <div className="header_text">
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Chats
                                </Typography>
                            </div>
                        </div>

                        <div className={`Sidebar_section ${this.props.components === "Subscriptions" ? "activeComponent" : ""}`} onClick={() => this.handlerComponent("Subscriptions")}>
                            <div className="header_icon">
                                <CurrencyRupeeOutlinedIcon />
                            </div>
                            <div className="header_text">
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Subscription
                                </Typography>
                            </div>
                        </div>

                        <div className={`Sidebar_section ${this.props.components === "UserRequest" ? "activeComponent" : ""}`} onClick={() => this.handlerComponent("UserRequest")}>
                            <div className="header_icon">
                                <PersonAddAltOutlinedIcon />
                            </div>
                            <div className="header_text">
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    User Request
                                </Typography>
                            </div>
                            {this.props.friendRequestListCount === 0 ? "" : <span className="count">{this.props.friendRequestListCount}</span>}
                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-item">
                        <button
                            className="Sidebar_section"
                            onClick={() => {
                                localStorage.removeItem("userId");
                                window.location.href = "/";
                            }}
                        >
                            <div className="header_icon">
                                <ExitToAppOutlinedIcon />
                            </div>
                            <div className="header_signout">
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Sign Out
                                </Typography>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;
