import React, { Component } from "react";
import "./Chats.css";
import { Avatar, Backdrop, Box, Button, Divider, Modal, Stack, Tooltip, Typography } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Users from "../Users/Users";
import { useSpring, animated } from "@react-spring/web";
import ViewProfile from "../ViewProfile/ViewProfile";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
interface joinRoomData {
    username: string;
    room: string;
}

interface data {
    Author: string;
    messages: string;
    time: string;
    Image?: string;
    audio?: string;
    video?: string;
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

interface Img {
    file: any;
    url: any;
}

interface onlineState {
    online: string;
}

interface LinksForModalTypes {
    linkTag: string;
    link: string;
}
interface chatStates {
    chatOpen: boolean;
    msg: string;
    roomData: joinRoomData;
    isTyping: boolean;
    currentAuthor: string;
    activeUserId: string;
    searchedUser: string;
    IsviewModal: boolean;
    isAttachOpen: boolean;
    isModal: boolean;
    windowWidth: number;
    isPickerVisible: boolean;
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
    sendImageHandler: () => void;
    sendVideoHandler: () => void;
    sendAudioHandler: () => void;
    sendImageChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sendVideoChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sendAudioChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    Img: Img;
    isAttach: boolean;
    closeAttachModal: () => void;
    LinksForModal: LinksForModalTypes;
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
            isTyping: false,
            currentAuthor: "",
            activeUserId: "",
            searchedUser: "",
            IsviewModal: false,
            isAttachOpen: true,
            isModal: false,
            windowWidth: window.innerWidth,
            isPickerVisible: false,
        };
    }

    componentDidMount(): void {
        window.addEventListener("resize", this.handleResize);
    }

    componentDidUpdate(prevProps: chatProps) {
        if (prevProps.messages !== this.props.messages) {
            this.props.scrollToBottom();
        }
    }

    componentWillUnmount(): void {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize = () => {
        this.setState({ windowWidth: window.innerWidth });
    };

    toggleEmojiPicker = () => {
        this.setState({ isPickerVisible: !this.state.isPickerVisible });
    };

    handleEmojiClick = (emojiData: EmojiClickData) => {
        this.setState((prevState) => ({ msg: prevState.msg + emojiData.emoji }));
    };

    chatMsg = (e: React.FormEvent) => {
        e.preventDefault();
        if (this.state.msg.trim()) {
            this.props.gettingMsg(this.props.selectedUser._id, this.state.msg);
            this.setState({
                msg: "",
                isAttachOpen: true,
            });
        } else {
            alert("Please enter a message");
        }
    };

    attachFilesSend = () => {
        this.props.gettingMsg(this.props.selectedUser._id, this.state.msg);
        this.setState({
            msg: "",
            isAttachOpen: true,
        });
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
            width: "90%",
            maxWidth: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 5,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        };

        const isModal_style = {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
            height: "auto",
            maxHeight: "600px",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 5,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        };

        const attach_modal_style = {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "fit-content",
            height: this.props.LinksForModal.linkTag === "video" || this.props.LinksForModal.linkTag === "audio" ? "auto !important" : "100% !important",
            maxHeight: "400px",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 5,
            display: "flex",
            flexDirection: "column",
            objectFit: "contain",
            overflow: "hidden",
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

        const chat_col_style1 = {
            display: "flex",
            alignItems: "start",
            height: this.state.windowWidth > 991 ? "100%" : "auto",
        };

        const isSelected = Object.values(this.props.selectedUser).every((value) => value === "");
        return (
            <div className="chatBox">
                <div className="col-xl-3 col-lg-4 col-md-12 col-12" style={chat_col_style1}>
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
                                            this.setState({
                                                activeUserId: val._id,
                                            });
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
                <div className={`col-xl-9 col-lg-8 col-md-12 col-12 d-flex align-items-center justify-content-center ${isSelected ? "h-100" : ""}`}>
                    {Object.values(this.props.selectedUser).every((value) => value === "") ? (
                        "No Converstion or Messages"
                    ) : (
                        <div className="chat_body">
                            <div className="chat_msg_header">
                                <Tooltip title="Click here to view the user's profile" placement="bottom">
                                    <div
                                        onClick={() => {
                                            this.setState({
                                                IsviewModal: true,
                                            });
                                        }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Avatar src={this.props.userData.length !== 0 ? this.props.selectedUser.photoName : ""} sx={{ width: 50, height: 50, border: "1px solid #ccc" }} />
                                        <Stack>
                                            <Typography variant="body1" component={"span"} sx={{ color: "black", fontWeight: 600, fontSize: "16px" }}>
                                                {this.props.selectedUser.firstName + " " + this.props.selectedUser.lastName}
                                            </Typography>
                                            <Typography sx={{ fontSize: "13px" }}>
                                                {this.props.onlineState.some((id) => (id as unknown) === this.props.selectedUser._id) ? "Online" : "Offline"}
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
                                </Tooltip>
                                {/* <div>
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
                                </div> */}

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
                                            float: msg.Author === this.props.selectedUser._id ? "left" : "right",
                                            clear: "both",
                                            margin: "16px 0",
                                            width: "auto",
                                            maxWidth: "90%",
                                            backgroundColor: msg.Author === this.props.selectedUser._id ? "#fff" : "#2196F3",
                                            padding: "10px",
                                            borderRadius: "10px",
                                            display: "flex",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: "inline-block",
                                                borderRadius: "10px",
                                                color: msg.Author === this.props.selectedUser._id ? "black" : "white",
                                                width: "auto",
                                                float: msg.Author === this.props.selectedUser._id ? "left" : "right",
                                                clear: "both",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {msg.messages}
                                        </span>
                                        <img
                                            style={{ cursor: "pointer" }}
                                            src={msg.Image}
                                            onClick={() => {
                                                this.setState({
                                                    isModal: true,
                                                });
                                            }}
                                            width={!msg.Image ? "0px" : this.state.windowWidth > 576 ? "300px" : "100%"}
                                            alt={""}
                                        ></img>
                                        <Modal
                                            open={this.state.isModal}
                                            onClose={() => {
                                                this.setState({
                                                    isModal: false,
                                                });
                                            }}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Box sx={isModal_style}>
                                                <img src={msg.Image} width={!msg.Image ? "0px" : this.state.windowWidth > 576 ? "300px" : "100%"} alt={""}></img>
                                            </Box>
                                        </Modal>
                                        {msg.audio ? (
                                            <audio controls>
                                                <source src={msg.audio ? msg.audio : undefined} />
                                            </audio>
                                        ) : undefined}
                                        <video
                                            width={!msg.video ? "0px" : this.state.windowWidth > 576 ? "300px" : "100%"}
                                            height={!msg.video ? "0px" : this.state.windowWidth > 576 ? "auto" : "300px"}
                                            controls
                                        >
                                            <source src={msg.video} type="video/mp4" />
                                        </video>
                                        <div ref={this.props.autoDiv}></div>
                                        <span
                                            style={{
                                                width: "auto",
                                                // display: "inline-block",
                                                fontSize: "11px",
                                                color: msg.Author === this.props.selectedUser._id ? "black" : "white",
                                                whiteSpace: "nowrap",
                                                // clear: "both",
                                                // float: "right",
                                                display: "flex",
                                                margin: "8px 0px 0px 8px",
                                                alignItems: "flex-end",
                                            }}
                                        >
                                            {msg.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Modal open={this.props.isAttach} onClose={this.props.closeAttachModal}>
                                <Box sx={attach_modal_style}>
                                    <Box style={{ height: "100%", objectFit: "contain", overflow: "hidden" }}>
                                        {this.props.LinksForModal.linkTag === "image" ? (
                                            <img style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} src={this.props.LinksForModal.link} alt=""></img>
                                        ) : this.props.LinksForModal.linkTag === "video" ? (
                                            <video width={"400px"} height={"auto"} controls>
                                                <source src={this.props.LinksForModal.link} />
                                            </video>
                                        ) : this.props.LinksForModal.linkTag === "audio" ? (
                                            <audio controls>
                                                <source src={this.props.LinksForModal.link} />
                                            </audio>
                                        ) : null}
                                    </Box>
                                    <Stack direction={"row"} justifyContent={"flex-end"} alignItems={"center"} style={{ minHeight: "70px", padding: "0px 20px" }} gap={"20px"}>
                                        <Button
                                            onClick={this.props.closeAttachModal}
                                            variant="outlined"
                                            style={{ width: "100%", color: "black", border: "1px solid black", textTransform: "capitalize" }}
                                        >
                                            Close
                                        </Button>
                                        <Button onClick={this.attachFilesSend} variant="contained" style={{ width: "100%", textTransform: "capitalize" }}>
                                            Send
                                        </Button>
                                    </Stack>
                                </Box>
                            </Modal>
                            <form onSubmit={this.chatMsg}>
                                <div className="chat_footer">
                                    <div className="EmojiDiv">
                                        <Button onClick={this.toggleEmojiPicker} variant="text" sx={{ borderRadius: "100%", width: "45px", height: "45px", minWidth: "45px", color: "rgb(59,68,75)" }}>
                                            <EmojiEmotionsOutlinedIcon />
                                        </Button>
                                    </div>
                                    {this.state.isPickerVisible && (
                                        <div style={{ position: "absolute", bottom: "70px", left: "10px", zIndex: 10 }}>
                                            <EmojiPicker onEmojiClick={this.handleEmojiClick} />
                                        </div>
                                    )}
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
                                    <input id="fileInput_image" name="fileInput_image" type="file" accept="image/*" style={{ display: "none" }} onChange={this.props.sendImageChangeHandler} />
                                    <input id="fileInput_video" name="fileInput_video" type="file" accept="video/*" style={{ display: "none" }} onChange={this.props.sendVideoChangeHandler} />
                                    <input id="fileInput_audio" name="fileInput_audio" type="file" accept="audio/*" style={{ display: "none" }} onChange={this.props.sendAudioChangeHandler} />
                                    {this.state.isAttachOpen === false ? (
                                        <div className="attachFile">
                                            <Tooltip title="Upload a image" placement="top">
                                                <Button
                                                    onClick={this.props.sendImageHandler}
                                                    variant="outlined"
                                                    sx={{ borderRadius: "100%", width: 45, height: 45, minWidth: 0, color: "#004F98", border: "1px solid #004F98" }}
                                                >
                                                    <PhotoLibraryIcon />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Upload a video" placement="top">
                                                <Button
                                                    onClick={this.props.sendVideoHandler}
                                                    variant="outlined"
                                                    sx={{ borderRadius: "100%", width: 45, height: 45, minWidth: 0, color: "#f82f6b", border: "1px solid #f82f6b" }}
                                                >
                                                    <VideoLibraryIcon />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Upload a audio" placement="top">
                                                <Button
                                                    onClick={this.props.sendAudioHandler}
                                                    variant="outlined"
                                                    sx={{ borderRadius: "100%", width: 45, height: 45, minWidth: 0, color: "orange", border: "1px solid orange" }}
                                                >
                                                    <AudioFileIcon />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    ) : null}
                                    <Button
                                        onClick={() => {
                                            this.setState({
                                                isAttachOpen: !this.state.isAttachOpen,
                                            });
                                        }}
                                        variant="contained"
                                        sx={{ borderRadius: "100%", width: 45, height: 45, minWidth: 45, backgroundColor: "#ccc", color: "black" }}
                                    >
                                        <AttachFileIcon />
                                    </Button>
                                    <Button type="submit" variant="contained" sx={{ borderRadius: "20px", width: "45px", height: "45px", minWidth: "45px", backgroundColor: "#2196F3" }}>
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
