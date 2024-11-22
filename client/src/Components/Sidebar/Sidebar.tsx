import React, { Component } from "react";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import "./Sidebar.css";
import { Button, Typography } from "@mui/material";

interface sidebarProps {
    componentRender: (val: string) => void;
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
                        <Typography variant="body1">Chat App</Typography>
                    </div>
                </div>
                <div className="Sidebar_Body">
                    <div>
                        <div className="Sidebar_section" onClick={() => this.handlerComponent("Profile")}>
                            <div className="header_icon">
                                <PersonOutlinedIcon />
                            </div>
                            <div className="header_text">
                                <Typography variant="body1">Profile</Typography>
                            </div>
                        </div>

                        <div className="Sidebar_section" onClick={() => this.handlerComponent("Chats")}>
                            <div className="header_icon">
                                <SendOutlinedIcon />
                            </div>
                            <div className="header_text">
                                <Typography variant="body1">Chats</Typography>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className="Sidebar_section">
                            <div className="header_icon">
                                <ExitToAppOutlinedIcon />
                            </div>
                            <div className="header_text">
                                <Typography variant="body1">Sign Out</Typography>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;
