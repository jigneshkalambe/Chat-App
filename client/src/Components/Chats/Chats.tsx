import React, { Component } from "react";
import "./Chats.css";
import { Avatar, Backdrop, Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Users from "../Users/Users";
import { useSpring, animated } from "@react-spring/web";
import ViewProfile from "../ViewProfile/ViewProfile";

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
    // selectedUser: userData;
    isTyping: boolean;
    currentAuthor: string;
    activeUserId: string;
    searchedUser: string;
    IsviewModal: boolean;
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
    deleteNewUserList: (user: userData) => void;
    selectedUser: userData;
    selectUserHandler: (value: userData) => void;
}

interface FadeProps {
    children: React.ReactElement<any>;
    in?: boolean;
    onClick?: any;
    onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
    onExited?: (node: HTMLElement, isAppearing: boolean) => void;
    ownerState?: any;
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(props, ref) {
    const { children, in: open, onClick, onEnter, onExited, ownerState, ...other } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter(null as any, true);
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited(null as any, true);
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {React.cloneElement(children, { onClick })}
        </animated.div>
    );
});

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

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
            // selectedUser: {
            //     _id: "",
            //     photoName: "",
            //     firstName: "",
            //     lastName: "",
            //     email: "",
            //     gender: "",
            //     age: "",
            //     number: "",
            //     location: "",
            //     bio: "",
            //     subtitle: "",
            // },
            isTyping: false,
            currentAuthor: "",
            activeUserId: "",
            searchedUser: "",
            IsviewModal: false,
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
            this.props.gettingMsg(this.props.selectedUser._id, this.state.msg);
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

    // selectUserHandler = (user: userData) => {
    //     this.setState({
    //         selectedUser: user,
    //     });
    //     // console.log(user);
    // };

    render() {
        console.log(this.props.selectedUser);
        const style = {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 5,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        };

        const renderMap =
            this.state.searchedUser !== ""
                ? this.props.userData.filter((data: any) => {
                      const fullName = `${data.firstName} ${data.lastName}`.toLowerCase().trim();
                      const searchTerm = this.state.searchedUser.toLowerCase().trim();

                      return (
                          fullName.includes(searchTerm) || (data.firstName && data.firstName.toLowerCase().includes(searchTerm)) || (data.lastName && data.lastName.toLowerCase().includes(searchTerm))
                      );
                  })
                : this.props.userData;

        return (
            <div className="chatBox">
                <div className="col-lg-3">
                    <div className="chat_left">
                        <div className="chat_header_box">
                            <input
                                type="text"
                                placeholder="Search Users"
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    this.setState({ searchedUser: event?.target.value.trim() });
                                }}
                            ></input>
                        </div>
                        <div className="chat_users">
                            {renderMap.map((val: any, ind: any) => {
                                return (
                                    <div
                                        key={ind}
                                        className={this.state.activeUserId === val._id ? "active-user" : ""}
                                        onClick={() => {
                                            this.setState(
                                                {
                                                    // selectedUser: val,
                                                    activeUserId: val._id,
                                                }
                                                // () => console.log(this.state.activeUserId, val._id)
                                            );
                                        }}
                                    >
                                        <Users
                                            selectUserHandler={this.props.selectUserHandler}
                                            deleteNewUserList={this.props.deleteNewUserList}
                                            user={val}
                                            activeUserId={this.state.activeUserId}
                                            onlineState={this.props.onlineState}
                                        />
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
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                sx={{ textTransform: "capitalize", fontSize: "16px", borderRadius: "20px", width: "100%", height: "45px", backgroundColor: "#2196F3" }}
                                            >
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
                    {Object.values(this.props.selectedUser).every((value) => value === "") ? (
                        "No Converstion or Messages"
                    ) : (
                        <div className="chat_body">
                            <div className="chat_msg_header">
                                <div>
                                    <Avatar src={this.props.userData.length !== 0 ? this.props.selectedUser.photoName : ""} sx={{ width: 50, height: 50, border: "1px solid #ccc" }} />
                                    <Stack>
                                        <Typography variant="body1" component={"span"} sx={{ color: "black", fontWeight: 600, fontSize: "18px" }}>
                                            {this.props.selectedUser.firstName + " " + this.props.selectedUser.lastName}
                                        </Typography>
                                        <Typography sx={{ fontSize: "13px" }}>
                                            {this.props.onlineState.some((id) => (id as unknown) === this.props.selectedUser._id) ? "Online" : this.state.isTyping === true ? "Typing..." : "Offline"}
                                            {/* {this.props.messages[this.props.selectedUser._id]?.find((msg) => msg.Author === this.props.selectedUser._id)
                                                    ? this.props.onlineState.some((id) => (id as unknown) === this.props.selectedUser._id)
                                                        ? "Online"
                                                        : this.state.isTyping === true
                                                        ? "Typing..."
                                                        : "Offline"
                                                    : "Offline"} */}
                                        </Typography>
                                    </Stack>
                                </div>
                                <div>
                                    <Button
                                        onClick={() => {
                                            this.setState({
                                                IsviewModal: true,
                                            });
                                        }}
                                        variant="contained"
                                        sx={{ textTransform: "capitalize", fontSize: "16px", borderRadius: "20px", height: "45px", backgroundColor: "#2196F3" }}
                                    >
                                        View Profile
                                    </Button>
                                </div>

                                <Modal
                                    aria-labelledby="spring-modal-title"
                                    aria-describedby="spring-modal-description"
                                    open={this.state.IsviewModal}
                                    onClose={() => {
                                        this.setState({
                                            IsviewModal: false,
                                        });
                                    }}
                                    closeAfterTransition
                                    slots={{ backdrop: Backdrop }}
                                    slotProps={{
                                        backdrop: {
                                            TransitionComponent: Fade,
                                        },
                                    }}
                                >
                                    <Fade in={this.state.IsviewModal}>
                                        <Box sx={style}>
                                            <ViewProfile onlineState={this.props.onlineState} userData={this.props.selectedUser} />
                                        </Box>
                                    </Fade>
                                </Modal>
                            </div>
                            <div className="chat_msg_body">
                                {this.props.messages[this.props.selectedUser._id]?.map((msg, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            textAlign: msg.Author === this.props.selectedUser._id ? "left" : "right",
                                            margin: "16px 0",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "inline-block",
                                                padding: "10px",
                                                borderRadius: "10px",
                                                backgroundColor: msg.Author === this.props.selectedUser._id ? "#fff" : "#2196F3",
                                                color: msg.Author === this.props.selectedUser._id ? "black" : "white",
                                                maxWidth: "80%",
                                            }}
                                        >
                                            <p style={{ margin: 0, whiteSpace: "wrap" }}>{msg.messages}</p>
                                            <div ref={this.props.autoDiv}></div>
                                            <span style={{ fontSize: "11px", color: msg.Author === this.props.selectedUser._id ? "black" : "white" }}>{msg.time}</span>
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
        );
    }
}

export default Chats;
