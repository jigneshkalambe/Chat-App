/* eslint-disable no-restricted-globals */
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
import { load } from "@cashfreepayments/cashfree-js";
import Subscription from "../Subscription/Subscription";
import FriendRequestPage from "../FriendRequests/FriendRequestPage";

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
    pendingMsgCount: number;
}

interface friendDataKey {
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
    isFriend: boolean;
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

interface friendData {
    from: string | null;
    to: string | null;
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
    DocPdfURL: string;
    isAttach: boolean;
    LinksForModal: LinksForModalTypes;
    cashfree: any;
    orderId: string;
    paymentSuccessfully: boolean;
    friendData: friendData;
    friendRequestList: friendDataKey[];
    friendRequestListCount: number;
    activeUserId: string;
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
                docpdf: "",
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
                pendingMsgCount: 0,
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
            cashfree: "",
            orderId: "",
            paymentSuccessfully: false,
            DocPdfURL: "",
            friendData: {
                from: "",
                to: "",
            },
            friendRequestList: [],
            activeUserId: "",
            friendRequestListCount: 0,
        };
        this.socket = io("https://chat-app-qu8l.onrender.com/");
        this.autoScroll = React.createRef();
    }

    componentDidMount(): void {
        this.currentAccount();
        this.socket.on("connect", () => {
            // console.log("Connected to the server", this.socket.id);
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
            const { senderId, message, time, Image, audio, video, docpdf } = data;
            if (message || Image || audio || video || docpdf) {
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
                                docpdf: docpdf,
                            },
                        ],
                    },
                }),
                async () => {
                    await axios
                        .post(`${process.env.REACT_APP_API_URL}/account/receiverMsg`, {
                            currentAccEmail: this.state.formData.email,
                            messages: this.state.messages,
                        })
                        .then((res) => {
                            console.log(res);
                            this.currentAccount();
                            if (res.status === 200) {
                                this.clearPendingCount();
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            if (err.status === 400) {
                                this.currentAccount();
                            }
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

        this.socket.on("friend_request", async (data) => {
            console.log(data);
            if (data) {
                await axios
                    .post(`${process.env.REACT_APP_API_URL}/account/newFriendRequest`, { from: data.from, to: data.to })
                    .then((res) => {
                        console.log(res);
                        if (res.status === 200) {
                            this.currentAccount();
                        }
                        toast.info(res.data.message, {
                            position: "bottom-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            theme: "light",
                            transition: Slide,
                        });
                        this.setState({
                            friendRequestListCount: this.state.friendRequestListCount + 1,
                        });
                    })
                    .catch((err) => console.log(err));
            } else {
                return;
            }
        });

        this.socket.on("editOrDelete", (data) => {
            if (data) {
                this.currentAccount();
            }
        });

        this.socket.on("onlineUsers", (online) => {
            // console.log("Online Users", online);
            this.setState({ onlineState: online });
        });

        this.socket.on("disconnect", () => {
            // console.log("Disconnectd to the server", this.socket.id);
        });

        this.initialzeSdk();
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

        if (this.state.formData.email && this.state.formData.email !== prevState.formData.email) {
            this.checkSubscriptionStatus();
        }
    }

    private scrollToBottom = (): void => {
        if (this.autoScroll.current) {
            this.autoScroll.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    clearPendingCount = async () => {
        await axios
            .post(`${process.env.REACT_APP_API_URL}/account/pendingMsg`, { currentAccEmail: this.state.formData.email, newUserEmail: this.state.selectedUser.email })
            .then((res) => {
                console.log(res);
                this.currentAccount();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    currentAccount = async () => {
        await axios
            .get(`${process.env.REACT_APP_API_URL}/account/accountList`)
            .then((res) => {
                const userId = localStorage.getItem("userId");
                const apiAccounts = res.data.accounts;
                const currentAccount = apiAccounts.find((acc: any) => acc._id === userId);
                // console.log("call-- CurrentAccount", currentAccount);
                // console.log(true);
                if (currentAccount) {
                    this.setState(
                        {
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
                            paymentSuccessfully: currentAccount?.paymentSuccessfully,
                            friendRequestList: currentAccount?.friendRequestList,
                        },
                        () => {
                            this.checkSubscriptionStatus();
                        }
                    );
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
            const publicUrl = await this.uploadFile(file, "Images");
            if (publicUrl) {
                this.setState({
                    formData: { ...this.state.formData, photoName: publicUrl },
                    photoLink: publicUrl,
                });
            }
        } else {
            console.log("No file selected");
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

    sendDocPdfHandler = () => {
        document.getElementById("fileInput_docpdf")?.click();
    };

    sendDocPdfChangeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const publicUrl = await this.uploadFile(file, "DocPdf");
            if (publicUrl) {
                console.log("Doc / Pdf uploaded successfully:", publicUrl);
                this.setState({
                    DocPdfURL: publicUrl,
                    LinksForModal: {
                        linkTag: "doc/pdf",
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
                        position: "bottom-center",
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
                        position: "bottom-center",
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
                console.log(res);
                // console.log("userData", this.state.userData);
                const exitsUser = this.state.userData.findIndex((user) => user._id === res.data.user._id);
                // console.log("roomhandler", exitsUser);
                // console.log("apiData", apiData);
                this.currentAccount();
                if (exitsUser === -1) {
                    localStorage.setItem("toUserId", res.data.user?._id);
                    this.setState(
                        {
                            friendData: {
                                from: localStorage.getItem("userId"),
                                to: res.data.user._id,
                            },
                        },
                        () => {
                            this.socket.emit("friend_request", { data: this.state.friendData });
                        }
                    );
                    this.currentAccount();
                    toast.success(res.data.message, {
                        position: "bottom-center",
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
                    position: "bottom-center",
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
        await this.checkSubscriptionStatus();
        const senderId = localStorage.getItem("userId");

        const newMessage = {
            Author: "me",
            messages: value,
            Image: this.state.Img.url,
            audio: this.state.AudioURL,
            video: this.state.VideoURL,
            docpdf: this.state.DocPdfURL,
            time: new Date().toLocaleTimeString(),
        };

        if (!this.state.paymentSuccessfully) {
            // eslint-disable-next-line no-restricted-globals
            if (confirm("Buy Premium package to unlock chatting service")) {
                this.setState({
                    components: "Subscriptions",
                });
            } else {
                console.log("Cancel");
            }
        } else {
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
                        docpdf: this.state.DocPdfURL,
                        time: new Date().toLocaleTimeString(),
                    });

                    await axios
                        .post(`${process.env.REACT_APP_API_URL}/account/msg`, {
                            userId: localStorage.getItem("userId"),
                            currentAccEmail: this.state.formData.email,
                            messages: this.state.messages,
                            onlineUsers: this.state.onlineState,
                            selectedUser: this.state.selectedUser,
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
                        DocPdfURL: "",
                        isAttach: false,
                        LinksForModal: {
                            link: "",
                            linkTag: "",
                        },
                    });
                }
            );
        }
    };

    deleteNewUserList = async (user: userData) => {
        await axios
            .post(`${process.env.REACT_APP_API_URL}/account/newUserList`, { currentAccEmail: this.state.formData.email, userData: user })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    this.currentAccount();
                    toast.success(res.data.message, {
                        position: "bottom-center",
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
                            pendingMsgCount: 0,
                        },
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message, {
                    position: "bottom-center",
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

    initialzeSdk = async () => {
        this.setState({
            cashfree: await load({
                mode: "sandbox",
            }),
        });
    };

    getSessionId = async (amount: string) => {
        try {
            if (this.state.messages[this.state.selectedUser._id]?.filter((val) => val.Author === "me").length >= 9) {
                this.setState({
                    paymentSuccessfully: false,
                });
            }

            await axios
                .post(`${process.env.REACT_APP_API_URL}/chatService/payment`, { amount: amount.toString() })
                .then((res) => {
                    if (res.data) {
                        console.log(res.data);
                        this.setState({
                            orderId: res.data.order_id,
                        });
                        let sessionId = res.data.payment_session_id;
                        let checkoutOptions = {
                            paymentSessionId: sessionId,
                            redirectTarget: "_modal",
                        };

                        this.state.cashfree.checkout(checkoutOptions).then((res: any) => {
                            console.log(res);
                            this.verifyPayment(res, amount);
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    };
    verifyPayment = async (res: any, amount: string) => {
        try {
            let response = await axios.post(`${process.env.REACT_APP_API_URL}/chatService/verify`, {
                orderId: this.state.orderId,
            });
            console.log(response);

            if (res.paymentDetails) {
                toast.success("Payment successful", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Slide,
                });
                this.setState(
                    {
                        paymentSuccessfully: true,
                    },
                    async () => {
                        try {
                            let response = await axios.post(`${process.env.REACT_APP_API_URL}/chatService/isPayment`, {
                                paymentSuccessfully: this.state.paymentSuccessfully,
                                currentAccEmail: this.state.formData.email,
                                amount: amount.toString(),
                            });
                            console.log(response);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                );
            } else {
                toast.error(res.error.message, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Slide,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    subscriptionsHandler = (amount: string) => {
        if (this.state.paymentSuccessfully) {
            toast.error("Plan is already purchased!", {
                position: "bottom-center",
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
            this.getSessionId(amount.toString());
        }
    };

    checkSubscriptionStatus = async () => {
        const email = this.state.formData?.email;
        if (!email) {
            console.error("Email is not defined.");
            return;
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/plan/subscription/${email}`);
            const { isExpired } = response.data;
            // console.log(response);
            if (isExpired) {
                this.setState({ paymentSuccessfully: false });
                toast.warning("Your subscription has expired. Please renew to continue.", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Slide,
                });
            }
        } catch (error) {
            console.error("Error checking subscription status:", error);
        }
    };

    navigateToChats = (user: any) => {
        this.setState({
            components: "Chats",
            selectedUser: user,
            activeUserId: user._id,
        });
    };

    activeUserIdFn = (Id: string) => {
        this.setState({
            activeUserId: Id,
        });
    };

    requestCountHandler = (text: string) => {
        if (text === "Accept" || text === "Reject") {
            this.setState({ friendRequestListCount: this.state.friendRequestListCount - 1 });
        }
    };

    render() {
        // console.log("SelectedUser", this.state.messages[this.state.selectedUser._id]);

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
                    formData={this.state.formData}
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
                    sendDocPdfHandler={this.sendDocPdfHandler}
                    sendDocPdfChangeHandler={this.sendDocPdfChangeHandler}
                    Img={this.state.Img}
                    isAttach={this.state.isAttach}
                    closeAttachModal={this.closeAttachModal}
                    LinksForModal={this.state.LinksForModal}
                    activeUserId={this.state.activeUserId}
                    activeUserIdFn={this.activeUserIdFn}
                    currentAccountFn={this.currentAccount}
                    socket={this.socket}
                />
            );
        } else if (components === "Subscriptions") {
            componentRender = <Subscription subscriptionsHandler={this.subscriptionsHandler} />;
        } else if (components === "UserRequest") {
            componentRender = (
                <FriendRequestPage
                    friendData={this.state.friendData}
                    friendRequestList={this.state.friendRequestList}
                    currentAccountFn={this.currentAccount}
                    navigateToChat={this.navigateToChats}
                    requestCountHandler={this.requestCountHandler}
                />
            );
        }
        return (
            <>
                {/* <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick={true} pauseOnHover={true} draggable={true} theme="light" transition={Slide} /> */}
                <div className="HomePage">
                    <Sidebar components={this.state.components} componentRender={this.componentRender} friendRequestListCount={this.state.friendRequestListCount} />
                    <HomeComponent>{componentRender}</HomeComponent>
                </div>
            </>
        );
    }
}

export default Home;
