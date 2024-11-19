import { Button, Card, Link, Stack, Typography } from "@mui/material";
import React, { Component } from "react";
import "./SignIn.css";
import HocInput from "../HocInput";

interface props {
    isSignIn: boolean;
    setSignIn: () => void;
}

export class SignIn extends Component<props> {
    render() {
        return (
            <Card className="MainCard">
                <Typography variant="h2" fontSize={30} fontWeight={500} textAlign={"center"}>
                    Sign In
                </Typography>
                <form>
                    <Stack>
                        <HocInput labelText="Email" type="email" name="email"></HocInput>
                        <HocInput labelText="Password" type="password" name="password"></HocInput>
                        <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
                            <div className="d-flex gap-2 align-items-center">
                                <HocInput type="checkbox" name="Remember me"></HocInput>
                                <Typography>Remember Me</Typography>
                            </div>
                            <Link href="#" underline="hover" sx={{ color: "#fff" }}>
                                Forgot Your Password ?
                            </Link>
                        </Stack>
                        <div className="mt-3">
                            <HocInput value={"Sign In"} type="button"></HocInput>
                        </div>
                    </Stack>
                </form>
                <Button onClick={this.props.setSignIn} variant="text" sx={{ textTransform: "none", color: "#fff", backgroundColor: "transparent" }}>
                    {this.props.isSignIn === false ? "Already have an account? Sign in here" : "Don't have an account? Create one now"}
                </Button>
            </Card>
        );
    }
}

export default SignIn;
