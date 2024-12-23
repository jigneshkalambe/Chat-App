import { Avatar, Box, Button, Card, Stack, Typography } from "@mui/material";
import React, { Component } from "react";
import "./SignUp.css";
import HocInput from "../HocInput";
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
interface props {
    isSignIn: boolean;
    setSignIn: () => void;
    getData: (e: React.ChangeEvent<HTMLInputElement>) => void;
    formData: formDataTypes;
    submitDataHandler: (e: React.FormEvent) => void;
    handleUploadClick: () => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    photoLink: string;
}

export class SignUp extends Component<props> {
    render() {
        return (
            <>
                <Card className="SignUpCard">
                    {/* <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick={true} pauseOnHover={true} draggable={true} theme="light" transition={Slide} /> */}
                    <input id="fileInput" name="fileInput" type="file" accept="image/*" style={{ display: "none" }} onChange={this.props.handleFileChange} />
                    <Typography variant="h2" fontSize={30} fontWeight={500} textAlign={"center"}>
                        Sign Up
                    </Typography>
                    <Box className="AvatarBox">
                        <Button sx={{ borderRadius: "50%" }} onClick={this.props.handleUploadClick}>
                            <Avatar sx={{ width: 70, height: 70, cursor: "pointer" }} src={this.props.photoLink}></Avatar>
                        </Button>
                        <Button onClick={this.props.handleUploadClick} variant="contained" sx={{ height: 35, textTransform: "none", backgroundColor: "#be91ca" }}>
                            <Typography variant="subtitle2" fontSize={20}>
                                Add Profile
                            </Typography>
                        </Button>
                    </Box>
                    <form onSubmit={this.props.submitDataHandler}>
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-12">
                                <Box>
                                    <Stack spacing={2} direction="row" sx={{ justifyContent: "space-between" }}>
                                        <HocInput formData={this.props.formData} getData={this.props.getData} labelText="First Name" placeholder="Enter First Name" type="text" name="firstName" />
                                        <HocInput formData={this.props.formData} getData={this.props.getData} labelText="Last Name" placeholder="Enter Last Name" type="text" name="lastName" />
                                    </Stack>
                                </Box>
                                <Stack>
                                    <HocInput formData={this.props.formData} getData={this.props.getData} placeholder="Enter Your Email" labelText="Email" type="email" name="email" />

                                    <HocInput formData={this.props.formData} getData={this.props.getData} labelText="Password" placeholder="Enter Password" type="password" name="password" />

                                    <HocInput
                                        formData={this.props.formData}
                                        getData={this.props.getData}
                                        labelText="Confirm Password"
                                        placeholder="Enter Confirm Password"
                                        type="password"
                                        name="confirmPassword"
                                    />
                                </Stack>
                            </div>
                            <div className="col-lg-6 col-md-12 col-12">
                                <Stack>
                                    <HocInput formData={this.props.formData} getData={this.props.getData} labelText="Gender" placeholder="Enter Your Gender" type="text" name="gender" />

                                    <HocInput formData={this.props.formData} getData={this.props.getData} labelText="Age" placeholder="Enter Your Age" type="number" name="age" min={0} max={120} />

                                    <HocInput formData={this.props.formData} getData={this.props.getData} labelText="Number" placeholder="Enter Your Number" type="number" name="number" />

                                    <div className="mt-3">
                                        <HocInput submitDataHandler={this.props.submitDataHandler} type="submit" value={"Submit"} />
                                    </div>
                                </Stack>
                            </div>
                        </div>
                    </form>
                    <Button
                        onClick={this.props.setSignIn}
                        variant="contained"
                        sx={{ textTransform: "none", color: "#fff", backgroundColor: "#be91ca", width: "100%", height: "50px", borderRadius: "20px" }}
                    >
                        {this.props.isSignIn === false ? "Already have an account? Sign in here" : "Don't have an account? Create one now"}
                    </Button>
                </Card>
            </>
        );
    }
}

export default SignUp;
