import React, { Component } from "react";
import "./Profile.css";
import { Avatar, Button, Stack, Typography } from "@mui/material";

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

interface profileProps {
    apiData: any;
    isEdit: boolean;
    editHandler: () => void;
    handleUploadClick: () => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    formData: formDataTypes;
}

export class Profile extends Component<profileProps> {
    render() {
        const data = this.props.apiData;
        const currentData = data.currentAccount;

        const none = {
            display: "none",
        };

        const display = {
            display: "block",
        };
        return (
            <div className="outerLayout">
                <form>
                    <Typography variant="h3">User Profile</Typography>
                    <div className="MainProfile">
                        <div className="profilePhotoLine">
                            <div>
                                <input id="fileInput" name="fileInput" type="file" accept="image/*" style={{ display: "none" }} onChange={this.props.handleFileChange} />
                                <Button sx={{ borderRadius: "100%", pointerEvents: this.props.isEdit === false ? "none" : "auto" }} onClick={this.props.handleUploadClick}>
                                    <Avatar sx={{ width: 100, height: 100 }} src={currentData?.photoName} />
                                </Button>
                                {this.props.isEdit === false ? (
                                    <Typography variant="subtitle1" component={"p"}>
                                        {currentData?.firstName + " " + currentData?.lastName}
                                    </Typography>
                                ) : (
                                    ""
                                )}

                                <Stack gap={1}>
                                    <input value={this.props.formData.firstName} style={this.props.isEdit === false ? none : display} type="text" className="form-control"></input>
                                    <input value={this.props.formData.lastName} style={this.props.isEdit === false ? none : display} type="text" className="form-control"></input>
                                    <input style={this.props.isEdit === false ? none : display} type="text" className="form-control"></input>
                                </Stack>
                            </div>
                        </div>
                        <div className="personalInfo">
                            <Typography variant="body2" component={"p"}>
                                Personal Information
                            </Typography>
                            <div className="d-flex gap-4">
                                <div className="col-lg-6">
                                    <div className="inputFlex">
                                        <div className="inputBox">
                                            <label>Email</label>
                                            {this.props.isEdit === false ? (
                                                <Typography variant="body1" component={"span"}>
                                                    {currentData?.email}
                                                </Typography>
                                            ) : (
                                                ""
                                            )}
                                            <input value={this.props.formData.email} style={this.props.isEdit === false ? none : display} type="email" className="form-control"></input>
                                        </div>
                                        <div className="inputBox">
                                            <label>Age</label>
                                            {this.props.isEdit === false ? (
                                                <Typography variant="body1" component={"span"}>
                                                    {currentData?.age}
                                                </Typography>
                                            ) : (
                                                ""
                                            )}
                                            <input value={this.props.formData.age} style={this.props.isEdit === false ? none : display} type="number" className="form-control"></input>
                                        </div>
                                        <div className="inputBox">
                                            <label>Location</label>
                                            {this.props.isEdit === false ? (
                                                <Typography variant="body1" component={"span"}>
                                                    {currentData?.location === "" ? "No location" : currentData?.location}
                                                </Typography>
                                            ) : (
                                                ""
                                            )}
                                            <input value={this.props.formData.location} style={this.props.isEdit === false ? none : display} type="text" className="form-control"></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="inputFlex">
                                        <div className="inputBox">
                                            <label>Phone Number</label>
                                            {this.props.isEdit === false ? (
                                                <Typography variant="body1" component={"span"}>
                                                    {currentData?.number}
                                                </Typography>
                                            ) : (
                                                ""
                                            )}
                                            <input value={this.props.formData.number} style={this.props.isEdit === false ? none : display} type="text" className="form-control"></input>
                                        </div>
                                        <div className="inputBox">
                                            <label>Gender</label>
                                            {this.props.isEdit === false ? (
                                                <Typography variant="body1" component={"span"}>
                                                    {currentData?.gender}
                                                </Typography>
                                            ) : (
                                                ""
                                            )}
                                            <input value={this.props.formData.gender} style={this.props.isEdit === false ? none : display} type="text" className="form-control"></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="BioSection">
                            <Typography variant="body1" component={"p"}>
                                Bio
                            </Typography>
                            {this.props.isEdit === false ? (
                                <Typography variant="body1" component={"span"}>
                                    {currentData?.bio === "" ? "No Bio" : currentData?.bio}
                                </Typography>
                            ) : (
                                ""
                            )}
                            <textarea value={this.props.formData.bio} style={this.props.isEdit === false ? none : display} className="form-control" />
                        </div>
                        <div className="ButtonLine">
                            <Button variant="contained" sx={{ textTransform: "capitalize", backgroundColor: "black" }} onClick={this.props.editHandler}>
                                <Typography>Edit Profile</Typography>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Profile;
