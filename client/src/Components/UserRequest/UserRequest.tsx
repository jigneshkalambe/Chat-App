import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import React, { Component } from "react";
import "./UserRequest.css";
import axios from "axios";
import { Slide, toast } from "react-toastify";

interface States {
    isAccept: string;
}

interface props {
    data: any;
    currentAccountFn: () => void;
    navigateToChat: (user: any) => void;
    requestCountHandler: (text: string) => void;
}

export class UserRequest extends Component<props, States> {
    constructor(props: props) {
        super(props);
        this.state = {
            isAccept: "",
        };
    }

    FriendRequestHandler = async (_id: string) => {
        await axios
            .post(`${process.env.REACT_APP_API_URL}/account/isAcceptRequest`, { CurrentAccId: localStorage.getItem("userId"), _id, text: this.state.isAccept })
            .then((res) => {
                console.log(res);

                if (res.status === 200) {
                    this.props.currentAccountFn();
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

                if (err.status === 400) {
                    this.props.currentAccountFn();
                }
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

    render() {
        const { data } = this.props;
        console.log(this.state.isAccept);
        return (
            <div className="UserRequestBox">
                <div className="ps-2 col-lg-1 col-md-2 col-sm-3 col-3">
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Avatar sx={{ height: 50, width: 50 }} src={data?.photoName} />
                    </Box>
                </div>
                <div className="pe-2 col-lg-8 col-md-6 col-sm-9 col-9">
                    <Box sx={{ display: "flex" }}>
                        <Stack direction={"column"}>
                            <Typography sx={{ color: "black", fontSize: "17px" }}>{`${data?.firstName} ${data?.lastName}`.trim()}</Typography>
                            <Typography variant="subtitle1" component={"span"} sx={{ color: "#a1a1aa" }}>
                                {data?.isFriend !== true ? "Sent you a friend request" : `You are now friend with ${data?.firstName}`}
                            </Typography>
                        </Stack>
                    </Box>
                </div>
                <div className="px-2 col-lg-3 col-md-4 col-sm-12 col-12 mt-md-0 mt-sm-3 mt-3">
                    <Box sx={{ display: "flex" }} justifyContent={this.state.isAccept !== "Accept" ? "space-between" : "center"} gap={2}>
                        {data?.isFriend !== true ? (
                            <>
                                <Button
                                    onClick={() => {
                                        this.setState({ isAccept: "Accept" }, () => {
                                            this.FriendRequestHandler(data._id);
                                            this.props.requestCountHandler(this.state.isAccept);
                                        });
                                    }}
                                    variant="contained"
                                    sx={{ textTransform: "capitalize", width: "100%", minWidth: 0 }}
                                >
                                    <Typography sx={{ fontSize: "18px", fontWeight: 700 }}>Accept</Typography>
                                </Button>
                                <Button
                                    onClick={() => {
                                        this.setState({ isAccept: "Reject" }, () => {
                                            this.FriendRequestHandler(data._id);
                                            this.props.requestCountHandler(this.state.isAccept);
                                        });
                                    }}
                                    color="error"
                                    variant="outlined"
                                    sx={{ textTransform: "capitalize", width: "100%", minWidth: 0, border: "2px solid #d32f2f" }}
                                >
                                    <Typography sx={{ fontSize: "18px", fontWeight: 700 }}>Reject</Typography>
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => {
                                    this.props.navigateToChat(this.props.data);
                                }}
                                variant="contained"
                                sx={{ textTransform: "capitalize", width: "100%" }}
                            >
                                <Typography sx={{ fontSize: "18px", fontWeight: 700 }}>Message</Typography>
                            </Button>
                        )}
                    </Box>
                </div>
            </div>
        );
    }
}

export default UserRequest;
