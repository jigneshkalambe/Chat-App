import React, { Component } from "react";
import "./ViewProfile.css";
import { Avatar, Badge, Box, Button, Modal, Stack, styled, Tooltip, Typography } from "@mui/material";

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

interface OnlineState {
    online: string;
}

interface viewProfileProps {
    userData: userData;
    onlineState: OnlineState[];
}

interface viewProfileStates {
    open: boolean;
}

export class ViewProfile extends Component<viewProfileProps, viewProfileStates> {
    constructor(props: viewProfileProps) {
        super(props);
        this.state = {
            open: false,
        };
    }
    render() {
        const StyledBadge = styled(Badge)(({ theme }) => ({
            "& .MuiBadge-badge": {
                backgroundColor: "#44b700",
                color: "#44b700",
                boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                "&::after": {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    animation: "ripple 1.2s infinite ease-in-out",
                    border: "1px solid currentColor",
                    content: '""',
                },
            },
            "@keyframes ripple": {
                "0%": {
                    transform: "scale(.8)",
                    opacity: 1,
                },
                "100%": {
                    transform: "scale(2.4)",
                    opacity: 0,
                },
            },
        }));
        const isOnline = this.props.onlineState.some((id) => (id as unknown) === this.props.userData._id);
        const style = {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            maxWidth: "500px",
            maxHeight: "500px",
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        };
        return (
            <div className="ViewProfile">
                <Stack alignItems={"center"}>
                    <Typography variant="subtitle1" component="p">
                        User Profile
                    </Typography>
                </Stack>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "150px",
                        margin: "8px 0px",
                    }}
                >
                    {/* <Avatar src={this.props.userData.photoName} sx={{ width: 120, height: 120, border: "1px solid #ccc" }} /> */}
                    <Tooltip title="Click to view the photo in full size." placement="top">
                        <Button
                            onClick={() => {
                                this.setState({
                                    open: true,
                                });
                            }}
                            sx={{ width: 120, height: 120, borderRadius: "50%" }}
                        >
                            <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant={isOnline ? "dot" : "standard"}>
                                <Avatar src={this.props.userData.photoName} sx={{ width: 120, height: 120, border: "1px solid #ccc" }} />
                            </StyledBadge>
                        </Button>
                    </Tooltip>
                    <Modal
                        open={this.state.open}
                        onClose={() => {
                            this.setState({ open: false });
                        }}
                    >
                        <Box
                            // sx={style}
                            className="img_modal"
                        >
                            <img src={this.props.userData.photoName} className="viewImage" alt={this.props.userData.photoName}></img>
                        </Box>
                    </Modal>
                    <Typography variant="body1" component="p" sx={{ margin: 0, fontSize: "16px", whiteSpace: "wrap" }}>
                        {this.props.userData.subtitle ? this.props.userData.subtitle : ""}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Stack direction={"row"} alignItems={"center"}>
                        <div className="col-3">
                            <Typography variant="subtitle1" component="span" sx={{ fontSize: "16px", fontWeight: 700 }}>
                                Name:
                            </Typography>
                        </div>
                        <div className="col-9">
                            <Typography variant="body1" component="p" sx={{ margin: 0, fontSize: "16px", whiteSpace: "wrap" }}>
                                {this.props.userData.firstName && this.props.userData.lastName === ""
                                    ? "The first name and last name are not available."
                                    : `${this.props.userData.firstName} ${this.props.userData.lastName}`.trim()}
                            </Typography>
                        </div>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                        <div className="col-3">
                            <Typography variant="subtitle1" component="span" sx={{ fontSize: "16px", fontWeight: 700 }}>
                                Email:
                            </Typography>
                        </div>
                        <div className="col-9">
                            <Typography variant="body1" component="p" sx={{ margin: 0, fontSize: "16px", whiteSpace: "wrap" }}>
                                {this.props.userData.email ? this.props.userData.email : "An email address is not provided."}
                            </Typography>
                        </div>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                        <div className="col-3">
                            <Typography variant="subtitle1" component="span" sx={{ fontSize: "16px", fontWeight: 700 }}>
                                Gender:
                            </Typography>
                        </div>
                        <div className="col-9">
                            <Typography variant="body1" component="p" sx={{ margin: 0, fontSize: "16px", whiteSpace: "wrap" }}>
                                {this.props.userData.gender ? this.props.userData.gender : "The gender information is not specified."}
                            </Typography>
                        </div>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                        <div className="col-3">
                            <Typography variant="subtitle1" component="span" sx={{ fontSize: "16px", fontWeight: 700 }}>
                                Age:
                            </Typography>
                        </div>
                        <div className="col-9">
                            <Typography variant="body1" component="p" sx={{ margin: 0, fontSize: "16px", whiteSpace: "wrap" }}>
                                {this.props.userData.age ? this.props.userData.age : "The age is not mentioned."}
                            </Typography>
                        </div>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                        <div className="col-3">
                            <Typography variant="subtitle1" component="span" sx={{ fontSize: "16px", fontWeight: 700 }}>
                                Number:
                            </Typography>
                        </div>
                        <div className="col-9">
                            <Typography variant="body1" component="p" sx={{ margin: 0, fontSize: "16px", whiteSpace: "wrap" }}>
                                {this.props.userData.number ? this.props.userData.number : "A phone number is not provided."}
                            </Typography>
                        </div>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                        <div className="col-3">
                            <Typography variant="subtitle1" component="span" sx={{ fontSize: "16px", fontWeight: 700 }}>
                                Location:
                            </Typography>
                        </div>
                        <div className="col-9">
                            <Typography variant="body1" component="p" sx={{ margin: 0, fontSize: "16px", whiteSpace: "wrap" }}>
                                {this.props.userData.location ? this.props.userData.location : "The location details are not available."}
                            </Typography>
                        </div>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                        <div className="col-3">
                            <Typography variant="subtitle1" component="span" sx={{ fontSize: "16px", fontWeight: 700 }}>
                                Bio:
                            </Typography>
                        </div>
                        <div className="col-9">
                            <Typography variant="body1" component="p" sx={{ margin: 0, fontSize: "16px", whiteSpace: "wrap" }}>
                                {this.props.userData.bio ? this.props.userData.bio : "The bio is not available."}
                            </Typography>
                        </div>
                    </Stack>
                </Box>
            </div>
        );
    }
}

export default ViewProfile;
