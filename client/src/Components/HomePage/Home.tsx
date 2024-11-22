import React, { Component } from "react";
import "./Home.css";
import Sidebar from "../Sidebar/Sidebar";
import HomeComponent from "../HomeComponents/HomeComponent";
import Profile from "../Profile/Profile";
import Chats from "../Chats/Chats";
import axios from "axios";

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
}

interface homeState {
    components: string;
    apiData: any;
    isEdit: boolean;
    formData: formDataTypes;
}

export class Home extends Component<{}, homeState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            components: "Profile",
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
            },
        };
    }
    componentDidMount(): void {
        this.currentAccount();
    }

    currentAccount = async () => {
        await axios
            .get(`${process.env.REACT_APP_API_URL}/account/accountList`)
            .then((res) => {
                console.log(res);
                const userId = localStorage.getItem("userId");
                const apiAccounts = res.data.accounts;
                const currentAccount = apiAccounts.find((acc: any) => acc._id === userId);
                console.log("CurrentAccount from Home", currentAccount);
                this.setState({
                    apiData: {
                        ...this.state.apiData,
                        currentAccount,
                    },
                    formData: {
                        photoName: this.state.apiData.currentAccount?.photoName || "",
                        firstName: this.state.apiData.currentAccount?.firstName || "",
                        lastName: this.state.apiData.currentAccount?.lastName || "",
                        email: this.state.apiData.currentAccount?.email || "",
                        gender: this.state.apiData.currentAccount?.gender || "",
                        age: this.state.apiData.currentAccount?.age || "",
                        number: this.state.apiData.currentAccount?.number || "",
                        location: this.state.apiData.currentAccount?.location || "",
                        bio: this.state.apiData.currentAccount?.bio || "",
                    },
                });
            })
            .catch((err) => console.log(err));
    };

    componentRender = (val: string): void => {
        this.setState({ components: val });
    };

    editHandler = (): void => {
        this.setState({ isEdit: !this.state.isEdit });
    };

    handleUploadClick = () => {
        document.getElementById("fileInput")?.click();
    };

    handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("File selected:", file);
            const formData = new FormData();
            formData.append("fileInput", file);

            await axios
                .post(`${process.env.REACT_APP_API_URL}/profile/upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => console.log(err));
        }
    };

    render() {
        console.log("Home Acc", this.state.formData);

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
                />
            );
        } else if (components === "Chats") {
            componentRender = <Chats />;
        }

        return (
            <div className="d-flex HomePage">
                <Sidebar componentRender={this.componentRender} />
                <HomeComponent>{componentRender}</HomeComponent>
            </div>
        );
    }
}

export default Home;
