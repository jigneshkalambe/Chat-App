import React, { Component } from "react";
import "./Chats.css";
import { Avatar, Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Users from "../Users/Users";

interface joinRoomData {
    username: string;
    room: string;
}

interface data {
    room: string | number;
    Author: string;
    messages: string;
    time: string;
}

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
interface chatStates {
    chatOpen: boolean;
    msg: string;
    roomData: joinRoomData;
    selectedUser: userData;
    isTyping: boolean;
    currentAuthor: string;
}

interface chatProps {
    gettingMsg: (recipientId: string, value: string) => void;
    data: data;
    roomHandler: (value: joinRoomData) => void;
    userData: userData[];
    onlineState: onlineState[];
    messages: { [userId: string]: data[] };
    autoDiv: React.RefObject<HTMLDivElement>;
    scrollToBottom: () => void;
}

export class Chats extends Component<chatProps, chatStates> {
    typingTimeout: any;
    constructor(props: any) {
        super(props);
        this.state = {
            chatOpen: false,
            msg: "",
            roomData: {
                username: "",
                room: "",
            },
            selectedUser: {
                _id: "",
                photoName: "",
                firstName: "",
                lastName: "",
                email: "",
                gender: "",
                age: "",
                number: "",
                location: "",
                bio: "",
                subtitle: "",
            },
            isTyping: false,
            currentAuthor: "",
        };
    }

    componentDidUpdate(prevProps: chatProps) {
        if (prevProps.messages !== this.props.messages) {
            this.props.scrollToBottom();
        }
    }

    chatMsg = (e: React.FormEvent) => {
        e.preventDefault();
        if (this.state.msg.trim()) {
            this.props.gettingMsg(this.state.selectedUser._id, this.state.msg);
            this.setState({
                msg: "",
            });
        }
    };

    joinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (this.state.roomData.room.trim() && this.state.roomData.username.trim()) {
            this.props.roomHandler(this.state.roomData);
            this.setState({
                roomData: {
                    ...this.state.roomData,
                    room: "",
                    username: "",
                },
                chatOpen: false,
            });
        } else {
            alert("Please fill in both fields");
        }
    };

    render() {
        const style = {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 5,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        };
        return (
            <div className="chatBox">
                <div className="row h-100">
                    <div className="col-lg-3">
                        <div className="chat_left">
                            <div className="chat_header_box">
                                <input type="text" placeholder="Search Users"></input>
                            </div>
                            <div className="chat_users">
                                {this.props.userData.map((val: any, ind: any) => {
                                    return (
                                        <div
                                            key={ind}
                                            onClick={() => {
                                                this.setState({
                                                    selectedUser: val,
                                                });
                                            }}
                                        >
                                            <Users user={val} onlineState={this.props.onlineState} />
                                            <Divider />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="chat_Add">
                                <Button
                                    onClick={() => {
                                        this.setState({ chatOpen: true });
                                    }}
                                    variant="contained"
                                    sx={{ width: "100%", height: "45px", borderRadius: "20px", display: "flex", gap: "20px", textTransform: "capitalize", backgroundColor: "#2196F3" }}
                                >
                                    <PersonAddOutlinedIcon /> <Typography>Add New Contact</Typography>
                                </Button>
                                <Modal
                                    open={this.state.chatOpen}
                                    onClose={() => {
                                        this.setState({ chatOpen: false });
                                    }}
                                >
                                    <form onSubmit={this.joinRoom}>
                                        <Box sx={style}>
                                            <Box>
                                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                                    Enter Email
                                                </Typography>
                                                <input
                                                    value={this.state.roomData.username}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        this.setState({ roomData: { ...this.state.roomData, username: event.target.value } });
                                                    }}
                                                    type="text"
                                                    placeholder="Enter Email"
                                                    className="form-control"
                                                ></input>
                                            </Box>
                                            <Box>
                                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                                    Enter Number
                                                </Typography>
                                                <input
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                        this.setState({ roomData: { ...this.state.roomData, room: event.target.value } });
                                                    }}
                                                    type="text"
                                                    value={this.state.roomData.room}
                                                    placeholder="Enter Number"
                                                    className="form-control"
                                                ></input>
                                            </Box>
                                            <Box>
                                                <Button type="submit" variant="contained" sx={{ borderRadius: "20px", width: "100%", height: "45px", backgroundColor: "#2196F3" }}>
                                                    New Chat
                                                </Button>
                                            </Box>
                                        </Box>
                                    </form>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9 d-flex align-items-center justify-content-center">
                        {Object.values(this.state.selectedUser).every((value) => value === "") ? (
                            "No Converstion or Messages"
                        ) : (
                            <div className="chat_body">
                                <div className="chat_msg_header">
                                    <div>
                                        <Avatar src={this.state.selectedUser.photoName} />
                                        <Stack>
                                            <Typography variant="body1" component={"span"} sx={{ color: "black", fontWeight: 600, fontSize: "18px" }}>
                                                {this.state.selectedUser.firstName + " " + this.state.selectedUser.lastName}
                                            </Typography>
                                            <Typography sx={{ fontSize: "13px" }}>
                                                {this.props.onlineState.some((id) => (id as unknown) === this.state.selectedUser._id)
                                                    ? "Online"
                                                    : this.state.isTyping === true
                                                    ? "Typing..."
                                                    : "Offline"}

                                                {/* {this.props.messages[this.state.selectedUser._id]?.find((msg) => msg.Author === this.state.selectedUser._id)
                                                    ? this.props.onlineState.some((id) => (id as unknown) === this.state.selectedUser._id)
                                                        ? "Online"
                                                        : this.state.isTyping === true
                                                        ? "Typing..."
                                                        : "Offline"
                                                    : "Offline"} */}
                                            </Typography>
                                        </Stack>
                                    </div>
                                </div>
                                <div className="chat_msg_body">
                                    {this.props.messages[this.state.selectedUser._id]?.map((msg, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                textAlign: msg.Author === this.state.selectedUser._id ? "left" : "right",
                                                margin: "16px 0",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "inline-block",
                                                    padding: "10px",
                                                    borderRadius: "10px",
                                                    backgroundColor: msg.Author === this.state.selectedUser._id ? "#fff" : "#2196F3",
                                                    color: msg.Author === this.state.selectedUser._id ? "black" : "white",
                                                    maxWidth: "60%",
                                                }}
                                            >
                                                <p style={{ margin: 0 }}>{msg.messages}</p>
                                                <div ref={this.props.autoDiv}></div>
                                                <span style={{ fontSize: "11px", color: msg.Author === this.state.selectedUser._id ? "black" : "white" }}>{msg.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={this.chatMsg}>
                                    <div className="chat_footer ">
                                        <input
                                            value={this.state.msg}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                this.setState({ msg: e.target.value });
                                            }}
                                            onKeyDown={(e: React.KeyboardEvent) => {
                                                this.setState({
                                                    isTyping: true,
                                                });

                                                if (this.typingTimeout) clearTimeout(this.typingTimeout);

                                                this.typingTimeout = setTimeout(() => {
                                                    this.setState({ isTyping: false });
                                                }, 1000);
                                            }}
                                            placeholder="Send Meassages"
                                            type="text"
                                        ></input>
                                        <Button type="submit" variant="contained" sx={{ borderRadius: "20px", height: "45px", backgroundColor: "#2196F3" }}>
                                            <SendOutlinedIcon />
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Chats;
