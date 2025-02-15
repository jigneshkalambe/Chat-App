import React, { Component } from "react";
import "./Chats.css";
import { Avatar, Backdrop, Box, Button, Dialog, DialogTitle, Divider, Menu, MenuItem, Modal, Paper, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
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
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import DocIcon from "../../Images/doc.png";
import PdfIcon from "../../Images/pdf.png";
import axios from "axios";
import { Socket } from "socket.io-client";

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
    docpdf?: string;
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
    pendingMsgCount: number;
}

interface formDataTypes {
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
    searchedUser: string;
    IsviewModal: boolean;
    isAttachOpen: boolean;
    isModal: boolean;
    windowWidth: number;
    isPickerVisible: boolean;
    currentImg: string | undefined;
    counts: number;
    anchorEl: HTMLElement | null;
    openDailog: boolean;
    dialogBoxTypes: "delete" | "edit";
    selectedMsg: data;
    editMsg: string;
    typingUserId: string | null | number;
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
    sendDocPdfHandler: () => void;
    sendImageChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sendVideoChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sendAudioChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sendDocPdfChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    Img: Img;
    isAttach: boolean;
    closeAttachModal: () => void;
    LinksForModal: LinksForModalTypes;
    activeUserIdFn: (Id: string) => void;
    activeUserId: string;
    formData: formDataTypes;
    currentAccountFn: () => void;
    socket: Socket;
    usersLoading: boolean;
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
            searchedUser: "",
            IsviewModal: false,
            isAttachOpen: true,
            isModal: false,
            windowWidth: window.innerWidth,
            isPickerVisible: false,
            currentImg: "",
            counts: 0,
            anchorEl: null,
            openDailog: false,
            dialogBoxTypes: "delete",
            selectedMsg: {
                Author: "",
                messages: "",
                time: "",
                Image: "",
                audio: "",
                video: "",
                docpdf: "",
            },
            editMsg: "",
            typingUserId: null,
        };
    }

    componentDidMount(): void {
        window.addEventListener("resize", this.handleResize);

        this.props.socket.on("userTyping", ({ senderId }) => {
            if (senderId === this.props.selectedUser._id) {
                this.setState({ isTyping: true });
            }
        });

        this.props.socket.on("userStoppedTyping", ({ senderId }) => {
            if (senderId === this.props.selectedUser._id) {
                this.setState({ isTyping: false });
            }
        });
    }

    componentDidUpdate(prevProps: Readonly<chatProps>, prevState: Readonly<chatStates>, snapshot?: any): void {
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
            setTimeout(() => {
                this.setState({
                    counts: this.state.counts + 1,
                });
            }, 3000);
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

    pendingChatHandler = async (val: any) => {
        await axios
            .post(`${process.env.REACT_APP_API_URL}/account/pendingMsg`, { currentAccEmail: this.props.formData.email, newUserEmail: val.email })
            .then((res) => {
                // console.log(res);
                this.props.currentAccountFn();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    dialogOpenHandler = () => {
        this.setState({ openDailog: true });
    };

    dialogCloseHandler = () => {
        this.setState({ openDailog: false });
    };

    deleteMsgHandler = async (value: string) => {
        await axios
            .post(`${process.env.REACT_APP_API_URL}/account/deleteMsg`, {
                currentAccEmail: this.props.formData.email,
                selectedUserId: this.props.selectedUser._id,
                selectedMsg: this.state.selectedMsg,
                deleteText: value,
            })
            .then((res) => {
                // console.log(res);
                this.setState({ openDailog: false });
                if (res.status === 200) {
                    this.props.currentAccountFn();
                    this.props.socket.emit("editOrDelete", { toUserId: this.props.selectedUser._id });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    editMsgHandler = async () => {
        await axios
            .post(`${process.env.REACT_APP_API_URL}/account/editMsg`, {
                currentAccEmail: this.props.formData.email,
                selectedUserId: this.props.selectedUser._id,
                selectedMsg: this.state.selectedMsg,
                editMsg: this.state.editMsg,
            })
            .then((res) => {
                // console.log("editMsgHandler", res);
                this.setState({ openDailog: false });
                if (res.status === 200) {
                    this.props.currentAccountFn();
                    this.props.socket.emit("editOrDelete", { toUserId: this.props.selectedUser._id });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
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
            width: this.state.windowWidth > 576 ? "100%" : "80%",
            height: "100%",
            maxWidth: this.state.windowWidth > 576 ? "400px" : "70%",
            maxHeight: this.state.windowWidth > 576 ? "400px" : "70%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "none",
            outline: "none",
        };

        const isModal_imgStyle = {
            border: "none",
            display: "block",
            height: "100%",
            objectFit: "contain",
        };

        const attachFilesBox = {
            width: "auto",
            maxWidth: "90%",
            height: this.props.LinksForModal.linkTag === "audio" ? "auto" : "200px",
            maxHeight: "200px",
            position: "absolute",
            bottom: "90px",
            left: "6px",
            backgroundColor: " rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(2px)",
            border: "1px solid #ccc",
            borderRadius: "10px",
            display: this.props.isAttach ? "block" : "none",
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

        const isEditBtnLeft = {
            minWidth: 0,
            width: 20,
            height: 30,
            color: "#3C3D37",
            position: "absolute",
            top: 0,
            right: "-20px",
        };

        const isEditBtnRight = {
            minWidth: 0,
            width: 20,
            height: 30,
            color: "#3C3D37",
            position: "absolute",
            top: 0,
            left: "-20px",
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
                            {this.props.usersLoading
                                ? // <Skeleton animation="wave" />
                                  Array.from({ length: renderMap?.length || 5 }).map((_, ind) => {
                                      return (
                                          <div key={ind} style={{ display: "flex", width: "100%", alignItems: "center", gap: "10px", padding: "20px", height: "93px" }}>
                                              <Skeleton variant="circular" width={50} height={50} animation="wave" />
                                              <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                                                  <Skeleton variant="text" width="100%" height={30} animation="wave" />
                                                  <Skeleton variant="text" width="60%" height={20} animation="wave" />
                                              </div>
                                          </div>
                                      );
                                  })
                                : renderMap.map((val: any, ind: any) => {
                                      return (
                                          <div
                                              key={ind}
                                              className={this.props.activeUserId === val._id ? "active-user" : ""}
                                              onClick={() => {
                                                  this.props.activeUserIdFn(val._id);
                                                  this.pendingChatHandler(val);
                                              }}
                                          >
                                              <Users
                                                  selectUserHandler={this.props.selectUserHandler}
                                                  deleteNewUserList={this.props.deleteNewUserList}
                                                  user={val}
                                                  activeUserId={this.props.activeUserId}
                                                  onlineState={this.props.onlineState}
                                                  socket={this.props.socket}
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
                <div className={`col-xl-9 col-lg-8 col-md-12 col-12 d-flex align-items-center justify-content-center bg-white ${isSelected ? "h-100" : ""}`}>
                    {this.props.selectedUser.email === "" && this.props.selectedUser.pendingMsgCount === 0 ? (
                        "No Conversations or Messages"
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
                                                {this.props.onlineState.some((id) => id.toString() === this.props.selectedUser._id) ? (this.state.isTyping ? "Typing..." : "Online") : "Offline"}
                                            </Typography>
                                        </Stack>
                                    </div>
                                </Tooltip>
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
                                            flexDirection: "column",
                                            position: "relative",
                                        }}
                                    >
                                        <Button
                                            variant="text"
                                            sx={msg.Author === this.props.selectedUser._id ? isEditBtnLeft : isEditBtnRight}
                                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                                this.setState({ anchorEl: event?.currentTarget, selectedMsg: msg, editMsg: msg.messages });
                                            }}
                                            aria-controls={open ? "basic-menu" : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? "true" : undefined}
                                        >
                                            <MoreVertOutlinedIcon />
                                        </Button>
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
                                                    currentImg: msg.Image,
                                                });
                                            }}
                                            width={!msg.Image ? "0px" : this.state.windowWidth > 576 ? "300px" : "100%"}
                                            alt={""}
                                        ></img>
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
                                        {msg.docpdf ? (
                                            <a
                                                href={msg.docpdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    width: !msg.docpdf ? "0px" : "100%",
                                                    maxWidth: "300px",
                                                    height: !msg.docpdf ? "0px" : "auto",
                                                    backgroundColor: msg.Author === this.props.selectedUser._id ? "#FAF3E0" : "#2196F3",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    padding: "8px",
                                                    textDecoration: "none",
                                                    boxSizing: "border-box",
                                                    flexDirection: this.state.windowWidth > 576 ? "row" : "column",
                                                    gap: this.state.windowWidth > 576 ? "0px" : "10px",
                                                }}
                                            >
                                                <Box sx={{ width: 100, height: 80, display: "block", marginRight: 1 }}>
                                                    <img
                                                        width={"100%"}
                                                        height={"100%"}
                                                        alt=""
                                                        src={
                                                            msg.docpdf?.split(".").pop()?.toLowerCase() === "pdf"
                                                                ? PdfIcon
                                                                : msg.docpdf?.split(".").pop()?.toLowerCase() === "doc" || "docx"
                                                                ? DocIcon
                                                                : ""
                                                        }
                                                    ></img>
                                                </Box>
                                                <Box sx={{ width: "100%" }}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        component={"p"}
                                                        sx={{ color: msg.Author === this.props.selectedUser._id ? "#000" : "#fff", fontSize: "15px", fontWeight: 600, wordBreak: "break-all" }}
                                                    >
                                                        {msg.docpdf ? msg.docpdf.split("/").pop()?.split(".").slice(0, -1).join(".") : "No File Name"}
                                                    </Typography>
                                                </Box>
                                            </a>
                                        ) : (
                                            ""
                                        )}
                                        <div ref={this.props.autoDiv}></div>
                                        <span
                                            style={{
                                                width: "auto",
                                                fontSize: "11px",
                                                color: msg.Author === this.props.selectedUser._id ? "black" : "white",
                                                whiteSpace: "nowrap",
                                                display: "flex",
                                                margin: "8px 0px 0px 0px",
                                                alignItems: "flex-end",
                                            }}
                                        >
                                            {msg.time}
                                        </span>
                                    </div>
                                ))}
                                <Paper>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={this.handleClose}
                                        MenuListProps={{
                                            "aria-labelledby": "basic-button",
                                        }}
                                        sx={{
                                            position: "absolute",
                                            top: "-95px",
                                            left: "-90px",
                                        }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                this.setState({
                                                    anchorEl: null,
                                                    openDailog: true,
                                                    dialogBoxTypes: "delete",
                                                });
                                            }}
                                            style={{ padding: "10px 20px", minWidth: "auto" }}
                                        >
                                            Delete
                                        </MenuItem>
                                        {this.state.selectedMsg?.Author !== this.props.selectedUser._id && (
                                            <MenuItem
                                                onClick={() => {
                                                    this.setState({
                                                        anchorEl: null,
                                                        openDailog: true,
                                                        dialogBoxTypes: "edit",
                                                    });
                                                }}
                                                style={{ padding: "10px 20px", minWidth: "auto" }}
                                            >
                                                Edit
                                            </MenuItem>
                                        )}
                                    </Menu>
                                </Paper>
                                <Dialog
                                    open={this.state.openDailog}
                                    keepMounted
                                    onClose={() => {
                                        this.setState({ openDailog: false });
                                    }}
                                    sx={{ boxShadow: 0 }}
                                    PaperProps={{
                                        sx: {
                                            maxWidth: "450px",
                                            width: "100%",
                                        },
                                    }}
                                >
                                    {this.state.dialogBoxTypes === "delete" ? (
                                        <>
                                            <DialogTitle>{"Delete message?"}</DialogTitle>
                                            <Stack direction={"column"} sx={{ padding: "10px" }}>
                                                <Stack direction={"row"} justifyContent={"flex-end"}>
                                                    <Button variant="text" onClick={() => this.deleteMsgHandler("for_me")}>
                                                        <Typography variant="subtitle1" component={"p"} sx={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>
                                                            delete for me
                                                        </Typography>
                                                    </Button>
                                                </Stack>
                                                <Stack direction={"row"} justifyContent={"flex-end"}>
                                                    <Button variant="text" onClick={this.dialogCloseHandler}>
                                                        <Typography variant="subtitle1" component={"p"} sx={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>
                                                            cancel
                                                        </Typography>
                                                    </Button>
                                                </Stack>
                                                {this.state.selectedMsg?.Author !== this.props.selectedUser._id && (
                                                    <Stack direction={"row"} justifyContent={"flex-end"}>
                                                        <Button variant="text" onClick={() => this.deleteMsgHandler("for_everyone")}>
                                                            <Typography variant="subtitle1" component={"p"} sx={{ fontSize: "16px", fontWeight: 600, margin: 0 }}>
                                                                delete for everyone
                                                            </Typography>
                                                        </Button>
                                                    </Stack>
                                                )}
                                            </Stack>
                                        </>
                                    ) : (
                                        <>
                                            <DialogTitle>{"Edit message"}</DialogTitle>
                                            <Box sx={{ display: "flex", gap: 1, padding: "10px" }}>
                                                <input
                                                    value={this.state.editMsg}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        this.setState({ editMsg: e.target.value });
                                                    }}
                                                    className="form-control w-100"
                                                    type="text"
                                                    placeholder="Edit Message"
                                                ></input>
                                                <Button variant="contained" onClick={this.editMsgHandler}>
                                                    <Typography variant="subtitle1" component={"p"} sx={{ fontSize: "16px", fontWeight: 600 }}>
                                                        Save
                                                    </Typography>
                                                </Button>
                                            </Box>
                                        </>
                                    )}
                                </Dialog>
                            </div>
                            <Modal
                                open={this.state.isModal}
                                onClose={() => {
                                    this.setState({
                                        isModal: false,
                                    });
                                }}
                            >
                                <Box sx={isModal_style}>
                                    <img
                                        style={isModal_imgStyle as any}
                                        src={this.state.currentImg}
                                        width={!this.state.currentImg ? "0px" : this.state.windowWidth > 576 ? "auto" : "100%"}
                                        alt={this.state.currentImg}
                                    ></img>
                                </Box>
                            </Modal>
                            <form onSubmit={this.chatMsg}>
                                <div className="chat_footer">
                                    <Box sx={attachFilesBox}>
                                        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    position: "absolute",
                                                    borderRadius: "100%",
                                                    minWidth: 0,
                                                    width: 30,
                                                    height: 30,
                                                    backgroundColor: "red",
                                                    color: "white",
                                                    border: "1px solid white",
                                                    right: "-10px",
                                                    top: "-12px",
                                                    padding: 0,
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                                onClick={this.props.closeAttachModal}
                                            >
                                                <CloseOutlinedIcon />
                                            </Button>
                                            {this.props.LinksForModal.linkTag === "image" ? (
                                                <img style={{ width: "100%", height: "100%", display: "block", objectFit: "contain" }} src={this.props.LinksForModal.link} alt=""></img>
                                            ) : this.props.LinksForModal.linkTag === "video" ? (
                                                <video width={"100%"} height={"100%"} controls>
                                                    <source src={this.props.LinksForModal.link} />
                                                </video>
                                            ) : this.props.LinksForModal.linkTag === "audio" ? (
                                                <audio controls>
                                                    <source src={this.props.LinksForModal.link} />
                                                </audio>
                                            ) : this.props.LinksForModal.linkTag === "doc/pdf" ? (
                                                <iframe title={"doc/pdf"} width={"100%"} height={"100%"} src={this.props.LinksForModal.link}></iframe>
                                            ) : null}
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    position: "absolute",
                                                    borderRadius: "100%",
                                                    minWidth: 0,
                                                    width: 35,
                                                    height: 35,
                                                    backgroundColor: "#2196f3",
                                                    color: "white",
                                                    border: "1px solid white",
                                                    bottom: "-10px",
                                                    right: "-8px",
                                                }}
                                                onClick={this.attachFilesSend}
                                            >
                                                <SendRoundedIcon />
                                            </Button>
                                        </Box>
                                    </Box>
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

                                            this.props.socket.emit("typing", {
                                                senderId: localStorage.getItem("userId"),
                                                recipientId: this.props.selectedUser._id,
                                            });

                                            // Clear the previous timeout
                                            if (this.typingTimeout) clearTimeout(this.typingTimeout);

                                            // Set a timeout to emit stopTyping after 1s of inactivity
                                            this.typingTimeout = setTimeout(() => {
                                                this.props.socket.emit("stopTyping", {
                                                    senderId: localStorage.getItem("userId"),
                                                    recipientId: this.props.selectedUser._id,
                                                });
                                            }, 1000);
                                        }}
                                        // onKeyDown={(e: React.KeyboardEvent) => {
                                        //     this.setState({
                                        //         isTyping: true,
                                        //     });

                                        //     if (this.typingTimeout) clearTimeout(this.typingTimeout);

                                        //     this.typingTimeout = setTimeout(() => {
                                        //         this.setState({ isTyping: false });
                                        //     }, 1000);
                                        // }}
                                        placeholder="Send Massages"
                                        type="text"
                                    ></input>
                                    <input id="fileInput_image" name="fileInput_image" type="file" accept="image/*" style={{ display: "none" }} onChange={this.props.sendImageChangeHandler} />
                                    <input id="fileInput_video" name="fileInput_video" type="file" accept="video/*" style={{ display: "none" }} onChange={this.props.sendVideoChangeHandler} />
                                    <input id="fileInput_audio" name="fileInput_audio" type="file" accept="audio/*" style={{ display: "none" }} onChange={this.props.sendAudioChangeHandler} />
                                    <input
                                        id="fileInput_docpdf"
                                        name="fileInput_docpdf"
                                        type="file"
                                        accept=".doc, .docx, .pdf"
                                        style={{ display: "none" }}
                                        onChange={this.props.sendDocPdfChangeHandler}
                                    />
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
                                            <Tooltip title="Upload a Doc / pdf" placement="top">
                                                <Button
                                                    onClick={this.props.sendDocPdfHandler}
                                                    variant="outlined"
                                                    sx={{ borderRadius: "100%", width: 45, height: 45, minWidth: 0, color: "black", border: "1px solid black" }}
                                                >
                                                    <InsertDriveFileOutlinedIcon />
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
                                    <Button
                                        disabled={this.state.msg === ""}
                                        type="submit"
                                        variant="contained"
                                        sx={{ borderRadius: "20px", width: "45px", height: "45px", minWidth: "45px", backgroundColor: "#2196F3" }}
                                    >
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
