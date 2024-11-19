import { Typography } from "@mui/material";
import React, { Component } from "react";

interface typesOfInput {
    type?: string;
    placeholder?: string;
    name?: string;
    min?: string | number;
    max?: string | number;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    labelText?: string;
}

export class HocInput extends Component<typesOfInput> {
    render() {
        const { type = "text", placeholder, name, min, max, value, onChange, labelText } = this.props;

        const inputStyle = {
            padding: "8px 12px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
        };

        const checkBoxStyle = {
            padding: "8px 12px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "18px",
            height: "18px",
        };

        const labelMargin = {
            display: "inline-block",
            marginBottom: "10px",
        };
        const checkMargin = {
            display: "inline-block",
            marginBottom: "0px",
        };

        return (
            <div style={type === "checkbox" ? { marginBottom: "0px", display: "flex", justifyContent: "center", alignItems: "center" } : { marginBottom: "16px" }}>
                {/* Optional Label */}
                {labelText && (
                    <Typography variant="body1" component="span" style={type === "checkbox" ? checkMargin : labelMargin}>
                        {/* <label style={{ display: "block", marginBottom: "8px" }}>{labelText}</label>  */}
                        {labelText}
                    </Typography>
                )}

                {/* Input Field */}
                <input
                    type={type}
                    placeholder={placeholder}
                    name={name}
                    min={min}
                    className={type === "button" ? "btn btn-dark d-block" : ""}
                    max={max}
                    value={value}
                    onChange={onChange}
                    style={type === "checkbox" ? checkBoxStyle : inputStyle}
                />
            </div>
        );
    }
}

export default HocInput;
