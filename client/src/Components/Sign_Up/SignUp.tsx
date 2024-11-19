import { Avatar, Box, Button, Card, Stack, Typography } from "@mui/material";
import React, { Component } from "react";
import "./SignUp.css";
import HocInput from "../HocInput";

interface props {
    isSignIn: boolean;
    setSignIn: () => void;
}

export class SignUp extends Component<props> {
    render() {
        return (
            <Card className="MainCard">
                <Typography variant="h2" fontSize={30} fontWeight={500} textAlign={"center"}>
                    Sign Up
                </Typography>
                <Box className="AvatarBox">
                    <Avatar sx={{ width: 50, height: 50 }}></Avatar>
                    <Typography variant="subtitle2" fontSize={20}>
                        Add Profile
                    </Typography>
                </Box>
                <form>
                    <Box>
                        <Stack spacing={2} direction="row">
                            <HocInput labelText="First Name" type="text" name="first name" />
                            <HocInput labelText="Last Name" type="text" name="last name" />
                        </Stack>
                    </Box>
                    <Stack>
                        <HocInput labelText="Email" type="email" name="email" />

                        <HocInput labelText="Gender" type="text" name="Gender" />

                        <HocInput labelText="Age" type="number" name="Age" min={0} max={100} />

                        <HocInput labelText="Number" type="number" name="Gender" min={0} max={9} />

                        <div className="mt-3">
                            <HocInput type="button" value={"Submit"} />
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

export default SignUp;
