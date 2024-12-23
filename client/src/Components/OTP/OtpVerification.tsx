import React, { Component } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";

interface State {
    otp: string[];
    error: string;
    isSubmitting: boolean;
}

class OtpVerification extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            otp: ["", "", "", "", "", ""],
            error: "",
            isSubmitting: false,
        };
    }

    handleChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...this.state.otp];
        newOtp[index] = value;
        this.setState({ otp: newOtp, error: "" });

        if (value && index < 5) {
            const nextField = document.getElementById(`otp-input-${index + 1}`);
            nextField?.focus();
        }
    };

    handleSubmit = () => {
        const otp = this.state.otp.join("");
        this.setState({ isSubmitting: true });

        if (otp.length !== 6 || !/^[0-9]{6}$/.test(otp)) {
            this.setState({
                error: "Please enter a valid 6-digit OTP.",
                isSubmitting: false,
            });
            return;
        }

        setTimeout(async () => {
            this.setState({ isSubmitting: false });
            await axios
                .post(`${process.env.REACT_APP_API_URL}/account/verifyOtp`, { otp })
                .then((res) => {
                    localStorage.setItem("userId", res.data.currentUser._id);
                    if (res.status === 200) {
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
                        setTimeout(() => {
                            window.location.href = "/home";
                        }, 2000);
                    }
                })
                .catch((err) => {
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
        }, 1500);
    };

    render() {
        const { otp, error, isSubmitting } = this.state;

        return (
            <>
                {/* <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick={true} pauseOnHover={true} draggable={true} theme="light" transition={Slide} /> */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                        backgroundColor: "#eef2f7",
                        padding: 2,
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            padding: 3,
                            borderRadius: 3,
                            maxWidth: 450,
                            width: "100%",
                            textAlign: "center",
                            backgroundColor: "#ffffff",
                        }}
                    >
                        <Typography variant="h4" gutterBottom sx={{ color: "#3a506b", fontWeight: "bold" }}>
                            Verify Your OTP
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                            Please enter the 6-digit code sent to your email.
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 1.5,
                                mb: 3,
                            }}
                        >
                            {otp.map((digit, index) => (
                                <TextField
                                    key={index}
                                    id={`otp-input-${index}`}
                                    value={digit}
                                    onChange={this.handleChange(index)}
                                    variant="outlined"
                                    inputProps={{
                                        maxLength: 1,
                                        style: { textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" },
                                    }}
                                    sx={{
                                        width: 50,
                                        height: "100%",
                                        borderRadius: 1,
                                        backgroundColor: "#f7f9fc",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    }}
                                    disabled={isSubmitting}
                                />
                            ))}
                        </Box>
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#3a506b",
                                color: "#ffffff",
                                fontWeight: "bold",
                                padding: "10px 20px",
                                "&:hover": {
                                    backgroundColor: "#2c4055",
                                },
                            }}
                            fullWidth
                            onClick={this.handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Verifying..." : "Verify OTP"}
                        </Button>
                    </Paper>
                </Box>
            </>
        );
    }
}

export default OtpVerification;
