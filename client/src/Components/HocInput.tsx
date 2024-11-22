import { Box, Typography } from "@mui/material";
import React, { Component } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

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
interface errTypes {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: string;
    age: string;
    number: string;
    [key: string]: string;
}

interface loginState {
    email: string;
    password: string;
}

interface typesOfInput {
    type?: string;
    placeholder?: string;
    name?: string;
    min?: string | number;
    max?: string | number;
    value?: string | number;
    getData?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    labelText?: string;
    formData?: formDataTypes | undefined;
    submitDataHandler?: (e: React.FormEvent) => void;
    id?: string;
    loginData?: loginState;
    getLoginData?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ControllerStates {
    err: errTypes;
    fieldColor: string | undefined;
    eye: boolean;
}

export class HocInput extends Component<typesOfInput, ControllerStates> {
    constructor(props: {}) {
        super(props);
        this.state = {
            err: {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                gender: "",
                age: "",
                number: "",
            },
            fieldColor: "",
            eye: false,
        };
    }

    render() {
        const { type = "text", placeholder, name, min, max, value, labelText, id } = this.props;

        const inputStyle = {
            padding: "8px 12px",
            fontSize: "16px",
            borderRadius: "20px",
            borderTop: "none",
            borderRight: "none",
            borderLeft: "none",
            borderBottom: "3px solid #ccc",
            width: "100%",
            height: "50px",
            borderColor: this.state.fieldColor === "" ? "#ccc" : this.state.fieldColor === "green" ? "green" : "red",
            outline: "none",
        };

        const checkBoxStyle = {
            padding: "8px 12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "18px",
            height: "18px",
        };

        const labelMargin = {
            display: "inline-block",
            marginBottom: "8px",
        };
        const checkMargin = {
            display: "inline-block",
            marginBottom: "0px",
        };

        const EyeBox: React.CSSProperties = {
            cursor: "pointer",
            fontSize: "20px",
            position: "absolute",
            top: "7px",
            right: "12px",
            borderLeft: "2px solid #ccc",
            padding: "0px 0px 0px 10px",
        };

        const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
            let value = e.target.value;
            let errs = { ...this.state.err },
                fieldColors;

            if (name === "firstName") {
                if (value.length < 2) {
                    errs.firstName = "First name must be at least 2 characters long.";
                    fieldColors = "red";
                } else {
                    errs.firstName = "";
                    fieldColors = "green";
                }
            }

            if (name === "lastName") {
                if (value.length < 2) {
                    errs.lastName = "Last name must be at least 2 characters long.";
                    fieldColors = "red";
                } else {
                    errs.lastName = "";
                    fieldColors = "green";
                }
            }

            if (name === "gender") {
                value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                // console.log(value);
                if (value === "Male" || value === "Female") {
                    errs.gender = "";
                    fieldColors = "green";
                } else {
                    errs.gender = "Please select a valid gender (Male or Female).";
                    fieldColors = "red";
                }
            }

            if (type === "email") {
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (value !== "") {
                    if (!regex.test(value)) {
                        errs.email = "Invalid Email";
                        fieldColors = "red";
                    } else {
                        errs.email = "";
                        fieldColors = "green";
                    }
                } else {
                    errs.email = "";
                    fieldColors = "";
                }
            }

            if (type === "number") {
                if (value !== "") {
                    if (value.length < 10) {
                        errs.number = "Please enter a number with no more than 10 digits.";
                        fieldColors = "red";
                    } else if (value.length > 10) {
                        errs.number = "Please enter a number with no more than 10 digits";
                        fieldColors = "red";
                    } else {
                        errs.number = "";
                        fieldColors = "green";
                    }
                } else {
                    errs.number = "";
                    fieldColors = "";
                }
            }

            if (type === "password" && name === "password") {
                if (value !== "") {
                    if (value.length === 8) {
                        errs.password = "";
                        fieldColors = "green";
                    } else if (value.length < 8) {
                        errs.password = "Password should be at least 8 characters long";
                        fieldColors = "red";
                    } else {
                        errs.password = "";
                        fieldColors = "green";
                    }
                } else {
                    errs.password = "";
                    fieldColors = "";
                }
            }

            if (type === "password" && name === "confirmPassword") {
                if (value !== "") {
                    if (value === this.props.formData?.password) {
                        errs.confirmPassword = "";
                        fieldColors = "green";
                    } else {
                        errs.confirmPassword = "Password does not Match";
                    }
                }
            }

            if (name === "age") {
                if (value !== "") {
                    if (value.length > 3) {
                        errs.age = "Age must be between 0 and 100.";
                        fieldColors = "red";
                    } else if (Number(value) > Number(max)) {
                        errs.age = `Age must be between 0 and ${Number(max)}.`;
                        fieldColors = "red";
                    } else {
                        errs.age = "";
                        fieldColors = "green";
                    }
                }
            }

            this.setState({ err: errs, fieldColor: fieldColors });

            if (this.props.getData) {
                this.props.getData(e);
            }
        };

        const BlurValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name } = e.target;
            let errs = { ...this.state.err };
            if (name === "firstName" && this.props.formData?.firstName === "") {
                errs.firstName = "Please enter your first name";
            } else if (name === "lastName" && this.props.formData?.lastName === "") {
                errs.lastName = "Please enter your last name";
            } else if (name === "email" && this.props.formData?.email === "") {
                errs.email = "Please enter your email address";
            } else if (name === "gender" && this.props.formData?.gender === "") {
                errs.gender = "Please enter your gender";
            } else if (name === "password" && this.props.formData?.password === "") {
                errs.password = "Please enter your password";
            } else if (name === "confirmPassword" && this.props.formData?.confirmPassword === "") {
                errs.confirmPassword = "Please enter confirm password";
            } else if (name === "age" && this.props.formData?.age.length === 0) {
                errs.age = "Please enter your age";
            } else if (name === "number" && this.props.formData?.number.length === 0) {
                errs.number = "Please enter your number";
            } else {
                // this.setState({
                //     err: { ...this.state.err, [name]: "" },
                // });
            }

            this.setState({
                err: errs,
            });
        };

        const loginChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            let errs = { ...this.state.err },
                fieldColors;

            if (type === "email") {
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (value !== "") {
                    if (!regex.test(value)) {
                        errs.email = "Invalid Email";
                        fieldColors = "red";
                    } else {
                        errs.email = "";
                        fieldColors = "green";
                    }
                } else {
                    errs.email = "";
                    fieldColors = "";
                }
            }

            if (type === "password" && name === "password") {
                if (value !== "") {
                    if (value.length === 8) {
                        errs.password = "";
                        fieldColors = "green";
                    } else if (value.length < 8) {
                        errs.password = "Password should be at least 8 characters long";
                        fieldColors = "red";
                    } else {
                        errs.password = "";
                        fieldColors = "green";
                    }
                } else {
                    errs.password = "";
                    fieldColors = "";
                }
            }

            this.setState({ err: errs, fieldColor: fieldColors });

            if (this.props.getLoginData) {
                this.props.getLoginData(e);
            }
        };

        const loginBlurValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name } = e.target;
            let errs = { ...this.state.err };

            if (name === "email" && this.props.loginData?.email === "") {
                errs.email = "Please enter email name";
            } else if (name === "password" && this.props.loginData?.password === "") {
                errs.password = "Please enter password name";
            }

            this.setState({
                err: errs,
            });
        };

        return (
            <div style={type === "checkbox" ? { marginBottom: "0px ", display: "flex", justifyContent: "center", alignItems: "center" } : { marginBottom: "10px" }}>
                {/* Optional Label */}
                {labelText && (
                    <Typography variant="body1" component="span" style={type === "checkbox" ? checkMargin : labelMargin}>
                        {labelText}
                    </Typography>
                )}

                {/* Input Field */}
                <div className="position-relative d-flex justify-content-center align-items-center">
                    <input
                        type={type !== "password" ? type : this.state.eye === false ? "password" : "text"}
                        placeholder={placeholder}
                        name={name}
                        min={min}
                        className={type === "submit" ? "btn btn-dark d-block" : ""}
                        max={max}
                        value={value}
                        onChange={id === "login" ? loginChangeHandler : changeHandler}
                        style={type === "checkbox" ? checkBoxStyle : inputStyle}
                        onBlur={id === "login" ? loginBlurValidation : BlurValidation}
                        list={name === "gender" ? "Genders" : ""}
                        autoComplete="off"
                    />
                    <datalist id="Genders">
                        <option value="Male" />
                        <option value="Female" />
                    </datalist>
                    {type === "password" ? (
                        <Box
                            style={EyeBox}
                            onClick={() => {
                                this.setState({ eye: !this.state.eye });
                            }}
                        >
                            {this.state.eye === false ? <VisibilityOffOutlinedIcon sx={{ color: "black" }} /> : <VisibilityOutlinedIcon sx={{ color: "black" }} />}
                        </Box>
                    ) : (
                        ""
                    )}
                </div>
                {name && this.state.err[name] && <p style={{ color: "red", marginTop: "10px", textAlign: "left", fontSize: "16px" }}>{this.state.err[name]}</p>}
            </div>
        );
    }
}

export default HocInput;
