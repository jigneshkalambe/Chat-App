import React, { Component } from "react";
import "./Home.css";
import Sidebar from "../Sidebar/Sidebar";
import HomeComponent from "../HomeComponents/HomeComponent";
import Profile from "../Profile/Profile";
import Chats from "../Chats/Chats";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { supabase } from "../supabaseClient";

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

interface data {
    Author: string;
    messages: string;
    time: string;
    Image?: string;
    audio?: string;
    video?: string;
}

interface joinRoomData {
    username: string;
    room: string;
}

interface Img {
    file: any;
    url: any;
}

interface LinksForModalTypes {
    linkTag: string;
    link: string;
}

interface homeState {
    components: string;
    apiData: any;
    isEdit: boolean;
    formData: formDataTypes;
    btnText: string;
    photoLink: string;
    data: data;
    joinRoomData: joinRoomData;
    userData: userData[];
    onlineState: [];
    messages: { [userId: string]: data[] };
    selectedUser: userData;
    Img: Img;
    AudioURL: string;
    VideoURL: string;
    isAttach: boolean;
    LinksForModal: LinksForModalTypes;
}

export class Home extends Component<{}, homeState> {
    private autoScroll: React.RefObject<HTMLDivElement>;
    private socket: Socket;
    constructor(props: {}) {
        super(props);
        this.state = {
            components: "Chats",
            apiData: {},
            isEdit: false,
            formData: {
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
            btnText: "Save Changes",
            photoLink: "",
            data: {
                Author: "",
                messages: "",
                Image: "",
                audio: "",
                video: "",
                time: new Date(Date.now()).toLocaleTimeString(),
            },
            joinRoomData: {
                username: "",
                room: "",
            },
            userData: [],
            onlineState: [],
            messages: {},
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
            Img: {
                file: null,
                url: "",
            },
            AudioURL: "",
            VideoURL: "",
            isAttach: false,
            LinksForModal: {
                linkTag: "",
                link: "",
            },
        };
        this.socket = io("http://localhost:5000");
        this.autoScroll = React.createRef();
    }

    componentDidMount(): void {
        this.currentAccount();

        this.socket.on("connect", () => {
            console.log("Connected to the server", this.socket.id);
        });

        const userId = localStorage.getItem("userId");
        if (userId) {
            this.socket.emit("register", userId);
        } else {
            console.error("No userId found in localStorage");
        }

        this.socket.on("privateMessage", (data: any) => {
            console.log(`Private message from ${data.senderId}: ${data.message}`);
            console.log("privateMessage:Data", data);
            const { senderId, message, time, Image, audio, video } = data;
            if (message || Image || audio || video) {
                console.log("Got Message From user", message);
                const notification = new Audio("/sound/chat-notification.mp3");
                notification.play();
            }
            this.setState(
                (prevState) => ({
                    messages: {
                        ...prevState.messages,
                        [senderId]: [
                            ...(prevState.messages[senderId] || []),
                            {
                                Author: senderId,
                                messages: message,
                                time,
                                Image: Image,
                                audio: audio,
                                video: video,
                            },
                        ],
                    },
                }),
                async () => {
                    await axios
                        .post(`${process.env.REACT_APP_API_URL}/account/msg`, {
                            currentAccEmail: this.state.formData.email,
                            messages: this.state.messages,
                        })
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            );
        });

        this.socket.on("userUpdated", (updatedUser) => {
            console.log("User updated:", updatedUser);

            this.setState((prevState) => ({
                userData: prevState.userData.map((user) => (user.email === updatedUser.email ? updatedUser : user)),
            }));
        });

        this.socket.on("onlineUsers", (online) => {
            console.log("Online Users", online);
            this.setState({ onlineState: online });
        });

        this.socket.on("disconnect", () => {
            console.log("Disconnectd to the server", this.socket.id);
        });
    }

    componentWillUnmount() {
        this.socket.off("connect");
        this.socket.off("privateMessage");
        this.socket.off("receive_msg");
        this.socket.off("disconnect");
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<homeState>, snapshot?: any): void {
        if (prevState.messages !== this.state.messages) {
            this.scrollToBottom();
        }
    }

    private scrollToBottom = (): void => {
        if (this.autoScroll.current) {
            this.autoScroll.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    currentAccount = async () => {
        await axios
            .get(`${process.env.REACT_APP_API_URL}/account/accountList`)
            .then((res) => {
                const userId = localStorage.getItem("userId");
                const apiAccounts = res.data.accounts;
                const currentAccount = apiAccounts.find((acc: any) => acc._id === userId);
                if (currentAccount) {
                    this.setState({
                        apiData: { currentAccount },
                        formData: {
                            photoName: currentAccount?.photoName || "",
                            firstName: currentAccount?.firstName || "",
                            lastName: currentAccount?.lastName || "",
                            email: currentAccount?.email || "",
                            gender: currentAccount?.gender || "",
                            age: currentAccount?.age || "",
                            number: currentAccount?.number || "",
                            location: currentAccount?.location || "",
                            bio: currentAccount?.bio || "",
                            subtitle: currentAccount?.subtitle || "",
                        },
                        photoLink: currentAccount?.photoName,
                        data: {
                            ...this.state.data,
                        },
                        userData: currentAccount?.newUserLists,
                        messages: currentAccount?.messages || {},
                    });
                }
            })
            .catch((err) => console.log(err));
    };

    componentRender = (val: string): void => {
        this.setState({ components: val });
    };

    editHandler = (): void => {
        this.setState({ isEdit: !this.state.isEdit });
        this.currentAccount();
    };

    handleUploadClick = () => {
        document.getElementById("fileInput")?.click();
    };

    handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("fileInput", file);

            await axios
                .post(`${process.env.REACT_APP_API_URL}/profile/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((res) => {
                    console.log(res);
                    this.setState({
                        formData: { ...this.state.formData, photoName: res.data.filePath },
                        photoLink: res.data.filePath,
                    });
                })
                .catch((err) => console.log(err));
        }
    };

    uploadFile = async (file: File, folder: string): Promise<string | null> => {
        const bucketName = "Attach_files";
        const fileName = `${folder}/${Date.now()}_${file.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
        });

        if (uploadError) {
            console.error(`Error uploading ${folder} file:`, uploadError.message);
            return null;
        }

        const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);

        if (!publicUrlData || !publicUrlData.publicUrl) {
            console.error("Error: Unable to fetch public URL.");
            return null;
        }

        const publicUrl = publicUrlData.publicUrl;
        console.log(`${folder} uploaded successfully:`, publicUrl);

        if (publicUrl) {
            this.setState({
                isAttach: true,
            });
        }

        return publicUrl;
    };

    sendImageHandler = () => {
        document.getElementById("fileInput_image")?.click();
    };

    sendImageChangeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const publicUrl = await this.uploadFile(file, "Images");
            if (publicUrl) {
                this.setState({
                    Img: {
                        url: publicUrl,
                        file: null,
                    },
                    LinksForModal: {
                        linkTag: "image",
                        link: publicUrl,
                    },
                });
            }
        } else {
            console.log("No file selected");
        }
    };

    sendVideoHandler = () => {
        document.getElementById("fileInput_video")?.click();
    };

    sendVideoChangeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const publicUrl = await this.uploadFile(file, "Videos");
            if (publicUrl) {
                console.log("Video uploaded successfully:", publicUrl);
                this.setState({
                    VideoURL: publicUrl,
                    LinksForModal: {
                        linkTag: "video",
                        link: publicUrl,
                    },
                });
            }
        }
    };

    sendAudioHandler = () => {
        document.getElementById("fileInput_audio")?.click();
    };

    sendAudioChangeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const publicUrl = await this.uploadFile(file, "Audio");
            if (publicUrl) {
                console.log("Audio uploaded successfully:", publicUrl);
                this.setState({
                    AudioURL: publicUrl,
                    LinksForModal: {
                        linkTag: "audio",
                        link: publicUrl,
                    },
                });
            }
        }
    };

    getUpdateData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [e.target.name]: e.target.value,
            },
        });
    };

    UpdateAccountHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const { formData } = this.state;

        this.setState({
            btnText: "Saving...",
        });

        setTimeout(async () => {
            await axios
                .post(`${process.env.REACT_APP_API_URL}/account/updateAccount`, formData)
                .then((res) => {
                    console.log(res);
                    if (res.status === 200) {
                        this.setState({
                            isEdit: false,
                            btnText: "Save Changes",
                        });
                        this.currentAccount();
                    }
                    toast.success(res.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                        transition: Slide,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(err.response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                        transition: Slide,
                    });
                });
        }, 2000);
    };

    roomHandler = async (value: joinRoomData) => {
        await axios
            .post(`${process.env.REACT_APP_API_URL}/account/findAccount`, { currentAccEmail: this.state.formData.email, email: value.username, number: value.room })
            .then((res) => {
                const apiData = res.data.user;
                const exitsUser = this.state.userData.find((user) => {
                    return user.email === apiData.email && user.number === apiData.number;
                });
                this.currentAccount();
                if (exitsUser) {
                    toast.error("User already exists", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                        transition: Slide,
                    });
                    return;
                } else {
                    localStorage.setItem("toUserId", res.data.user?._id);
                    this.currentAccount();
                    toast.success(res.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                        transition: Slide,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Slide,
                });
            });
    };

    gettingMsg = async (recipientId: string, value: string) => {
        const senderId = localStorage.getItem("userId");

        const newMessage = {
            Author: "me",
            messages: value,
            Image: this.state.Img.url,
            audio: this.state.AudioURL,
            video: this.state.VideoURL,
            time: new Date().toLocaleTimeString(),
        };

        this.setState(
            (prevState) => ({
                messages: {
                    ...prevState.messages,
                    [recipientId]: [...(prevState.messages[recipientId] || []), newMessage],
                },
            }),
            async () => {
                this.socket.emit("privateMessage", {
                    toUserId: recipientId,
                    senderId,
                    message: value,
                    Image: this.state.Img.url,
                    audio: this.state.AudioURL,
                    video: this.state.VideoURL,
                    time: new Date().toLocaleTimeString(),
                });

                await axios
                    .post(`${process.env.REACT_APP_API_URL}/account/msg`, {
                        currentAccEmail: this.state.formData.email,
                        messages: this.state.messages,
                    })
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                this.setState({
                    Img: {
                        file: null,
                        url: "",
                    },
                    VideoURL: "",
                    AudioURL: "",
                    isAttach: false,
                    LinksForModal: {
                        link: "",
                        linkTag: "",
                    },
                });
            }
        );
    };

    deleteNewUserList = async (user: userData) => {
        await axios
            .post(`${process.env.REACT_APP_API_URL}/account/newUserList`, { currentAccEmail: this.state.formData.email, userData: user })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    this.currentAccount();
                    toast.success(res.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                        transition: Slide,
                    });
                    this.setState({
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
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Slide,
                });
            });
    };

    selectUserHandler = (user: userData) => {
        this.setState({
            selectedUser: user,
        });
    };

    closeAttachModal = () => {
        this.setState({
            isAttach: false,
            LinksForModal: {
                link: "",
                linkTag: "",
            },
            Img: {
                file: null,
                url: "",
            },
            VideoURL: "",
            AudioURL: "",
        });
    };

    render() {
        console.log("Messages", this.state.messages);
        const { components } = this.state;
        let componentRender: JSX.Element | null = null;

        if (components === "Profile") {
            componentRender = (
                <Profile
                    apiData={this.state.apiData}
                    isEdit={this.state.isEdit}
                    editHandler={this.editHandler}
                    handleUploadClick={this.handleUploadClick}
                    handleFileChange={this.handleFileChange}
                    formData={this.state.formData}
                    getUpdateData={this.getUpdateData}
                    btnText={this.state.btnText}
                    UpdateAccountHandler={this.UpdateAccountHandler}
                    photoLink={this.state.photoLink}
                />
            );
        } else if (components === "Chats") {
            componentRender = (
                <Chats
                    autoDiv={this.autoScroll}
                    scrollToBottom={this.scrollToBottom}
                    messages={this.state.messages}
                    onlineState={this.state.onlineState}
                    userData={this.state.userData}
                    data={this.state.data}
                    gettingMsg={this.gettingMsg}
                    roomHandler={this.roomHandler}
                    deleteNewUserList={this.deleteNewUserList}
                    selectedUser={this.state.selectedUser}
                    selectUserHandler={this.selectUserHandler}
                    sendImageHandler={this.sendImageHandler}
                    sendImageChangeHandler={this.sendImageChangeHandler}
                    sendVideoHandler={this.sendVideoHandler}
                    sendVideoChangeHandler={this.sendVideoChangeHandler}
                    sendAudioHandler={this.sendAudioHandler}
                    sendAudioChangeHandler={this.sendAudioChangeHandler}
                    Img={this.state.Img}
                    isAttach={this.state.isAttach}
                    closeAttachModal={this.closeAttachModal}
                    LinksForModal={this.state.LinksForModal}
                />
            );
        }
        return (
            <>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick={true} pauseOnHover={true} draggable={true} theme="light" transition={Slide} />
                <div className="HomePage">
                    <Sidebar components={this.state.components} componentRender={this.componentRender} />
                    <HomeComponent>{componentRender}</HomeComponent>
                </div>
            </>
        );
    }
}

export default Home;
