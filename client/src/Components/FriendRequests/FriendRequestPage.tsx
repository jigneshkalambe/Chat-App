import React, { Component } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import UserRequest from "../UserRequest/UserRequest";
import "./FriendRequestPage.css";

interface friendData {
    from: string | null;
    to: string | null;
}

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

interface States {
    data: formDataTypes[];
}

interface props {
    friendData: friendData;
    friendRequestList: friendDataKey[];
    currentAccountFn: () => void;
    navigateToChat: (user: any) => void;
    requestCountHandler: (text: string) => void;
}

export class FriendRequestPage extends Component<props, States> {
    constructor(props: any) {
        super(props);
        this.state = {
            data: [],
        };
    }

    render() {
        const isData = {
            display: "block",
            border: "1px solid #ccc",
            marginTop: "20px",
            boxSizing: "border-box",
            height: "100%",
            borderRadius: "20px",
            overflow: "auto",
        };

        const data = {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
            height: "100%",
            borderRadius: "20px",
            border: "1px solid #ccc",
            marginTop: "20px",
            overflow: "auto",
        };

        return (
            <Box className="RequestBox">
                <Stack direction={"row"} justifyContent={"center"} borderBottom={"1px solid #ccc"} paddingBottom={2.2}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Friend Requests
                    </Typography>
                </Stack>
                <Box sx={this.props.friendRequestList.length === 0 ? data : isData}>
                    {this.props.friendRequestList.length === 0
                        ? "There is no friend request"
                        : this.props.friendRequestList.map((val: any, ind: any) => {
                              return (
                                  <div key={ind}>
                                      <UserRequest
                                          data={val}
                                          currentAccountFn={this.props.currentAccountFn}
                                          navigateToChat={this.props.navigateToChat}
                                          requestCountHandler={this.props.requestCountHandler}
                                      />
                                      <Divider sx={{ borderColor: "#ccc" }} />
                                  </div>
                              );
                          })}
                </Box>
            </Box>
        );
    }
}

export default FriendRequestPage;
