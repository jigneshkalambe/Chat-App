import { Button, Card, Link, Stack, Typography } from "@mui/material";
import React, { Component } from "react";
import "./SignIn.css";
import HocInput from "../HocInput";
import "./SignIn.css";
import { Slide, ToastContainer } from "react-toastify";

interface formDataTypes {
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
interface props {
    isSignIn: boolean;
    setSignIn: () => void;
    getData: (e: React.ChangeEvent<HTMLInputElement>) => void;
    formData: formDataTypes;
    submitDataHandler: (e: React.FormEvent) => void;
    loginData: loginState;
    loginAccount: (e: React.FormEvent) => void;
    getLoginData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export class SignIn extends Component<props> {
    render() {
        return (
            <Card className="MainCard">
                {/* <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick={true} pauseOnHover={true} draggable={true} theme="light" transition={Slide} /> */}
                <Typography variant="h2" fontSize={30} fontWeight={500} textAlign={"center"}>
                    Sign In
                </Typography>
                <form onSubmit={this.props.loginAccount}>
                    <Stack>
                        <HocInput
                            loginData={this.props.loginData}
                            getLoginData={this.props.getLoginData}
                            formData={this.props.formData}
                            id="login"
                            labelText="Email"
                            type="email"
                            name="email"
                            placeholder="Enter Your Email"
                        ></HocInput>
                        <HocInput
                            loginData={this.props.loginData}
                            getLoginData={this.props.getLoginData}
                            formData={this.props.formData}
                            id="login"
                            labelText="Password"
                            type="password"
                            name="password"
                            placeholder="Enter Your Password"
                        ></HocInput>
                        <Stack direction={"row"} sx={{ justifyContent: "space-between", marginTop: "10px" }}>
                            <div className="d-flex gap-2 align-items-center ">
                                <HocInput type="checkbox" name="Remember me"></HocInput>
                                <Typography className="signin_texts">Remember Me</Typography>
                            </div>
                            <Link className="signin_texts" href="#" underline="hover" sx={{ color: "#000" }}>
                                Forgot Your Password ?
                            </Link>
                        </Stack>
                        <div className="mt-3">
                            <HocInput submitDataHandler={this.props.submitDataHandler} value={"Sign In"} type="submit"></HocInput>
                        </div>
                    </Stack>
                </form>
                <Button onClick={this.props.setSignIn} variant="text" sx={{ textTransform: "none", color: "#fff", backgroundColor: "#be91ca", height: "50px", borderRadius: "20px" }}>
                    {this.props.isSignIn === false ? "Already have an account? Sign in here" : "Don't have an account? Create one now"}
                </Button>
            </Card>
        );
    }
}

export default SignIn;
