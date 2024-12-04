import axios from "axios";
import React, { Component } from "react";
import { Slide, toast } from "react-toastify";
interface formDataTypes {
    photoName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: string;
    age: string;
    number: string;
}

interface loginState {
    email: string;
    password: string;
}

interface ChatStates {
    isSignIn: boolean;
    formData: formDataTypes;
    errors: formDataTypes;
    photoLink: string;
    loginData: loginState;
}

export class Controller extends Component<{}, ChatStates> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isSignIn: true,
            formData: {
                photoName: "",
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                gender: "",
                age: "",
                number: "",
            },
            errors: {
                photoName: "",
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                gender: "",
                age: "",
                number: "",
            },
            photoLink: "",
            loginData: {
                email: "",
                password: "",
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
                console.log("CurrentAccount", currentAccount);
                this.setState({
                    photoLink: currentAccount?.photoName,
                });
            })
            .catch((err) => console.log(err));
    };

    setSignIn = () => {
        this.setState({
            isSignIn: !this.state.isSignIn,
        });
    };

    getData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        this.setState({
            formData: { ...this.state.formData, [name]: value },
        });
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
                    this.setState({
                        formData: { ...this.state.formData, photoName: res.data.filePath },
                        photoLink: res.data.filePath,
                    });
                })
                .catch((err) => console.log(err));
        }
    };

    submitDataHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        const { formData } = this.state;

        await axios
            .post(`${process.env.REACT_APP_API_URL}/account/createAccount`, formData)
            .then((res) => {
                console.log(res);

                localStorage.setItem("userId", res.data.data._id);

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
                if (res.status === 200 || 201) {
                    setTimeout(() => {
                        window.location.href = "/home";
                    }, 2000);
                }
            })
            .catch((err) => {
                console.log(err.response);
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

    getLoginData = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        this.setState({
            loginData: {
                ...this.state.loginData,
                [name]: value,
            },
        });
    };

    loginAccount = async (e: React.FormEvent) => {
        e.preventDefault();

        const { loginData } = this.state;
        await axios
            .post(`${process.env.REACT_APP_API_URL}/account/loginAccount`, loginData)
            .then((res) => {
                console.log(res);
                localStorage.setItem("userId", res.data.currentUser._id);
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
                this.currentAccount();

                if (res.status === 200 || 201) {
                    setTimeout(() => {
                        window.location.href = "/home";
                    }, 2000);
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
}

export default Controller;
