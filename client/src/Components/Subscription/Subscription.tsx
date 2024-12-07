import React, { Component } from "react";
import "./Subscription.css";
import { Box, Button, Card, CardActions, CardContent, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

interface SubscriptionProps {
    subscriptionsHandler: (amount: string) => void;
}

export class Subscription extends Component<SubscriptionProps> {
    render() {
        return (
            <div className="SubscriptionBox">
                <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography variant="h3" sx={{ color: "black" }}>
                        Choose Your Chat Service Plan
                    </Typography>
                </Box>
                <div className="row g-3">
                    <div className="col-lg-4 col-md-6 col-sm-12 px-2">
                        <Card className="CardHeight">
                            <CardContent>
                                <Stack direction={"column"} sx={{ gap: "0px", marginBottom: "20px" }}>
                                    <Typography variant="h5" sx={{ color: "black", fontWeight: 700 }}>
                                        Basic
                                    </Typography>
                                    <Typography variant="subtitle1" component="span" sx={{ color: "#71717a" }}>
                                        Perfect for short-term
                                    </Typography>
                                </Stack>
                                <Stack direction={"column"} gap={1} sx={{ marginBottom: "20px" }}>
                                    <Typography variant="h4" sx={{ color: "black", fontWeight: 800 }}>
                                        ₹50
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: "black", fontWeight: 700, fontSize: "20px" }}>
                                        for 1 months
                                    </Typography>
                                </Stack>
                                <Box>
                                    <List>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Full access to chat service for 1 month" />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="24/7 chat availability" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Up to 100 messages per day" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Basic chatbot customization" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Email support" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Access to knowledge base" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                    </List>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button
                                    onClick={() => this.props.subscriptionsHandler("50")}
                                    variant="outlined"
                                    sx={{ width: "100%", textTransform: "capitalize", fontWeight: 700, color: "black", border: "2px solid black", fontSize: "18px" }}
                                >
                                    Choose basic plan
                                </Button>
                            </CardActions>
                        </Card>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 px-2">
                        <Card className="CardHeight">
                            <CardContent>
                                <Stack direction={"column"} sx={{ gap: "0px", marginBottom: "20px" }}>
                                    <Typography variant="h5" sx={{ color: "black", fontWeight: 700 }}>
                                        Standard
                                    </Typography>
                                    <Typography variant="subtitle1" component="span" sx={{ color: "#71717a" }}>
                                        Great value for medium-term
                                    </Typography>
                                </Stack>
                                <Stack direction={"column"} gap={1} sx={{ marginBottom: "20px" }}>
                                    <Typography variant="h4" sx={{ color: "black", fontWeight: 800 }}>
                                        ₹100
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: "black", fontWeight: 700, fontSize: "20px" }}>
                                        for 2 months
                                    </Typography>
                                </Stack>
                                <Box>
                                    <List>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Full access to chat service for 1 month" />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="24/7 chat availability" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Up to 500 messages per day" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Advanced chatbot customization" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Priority email and chat support" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Access to premium knowledge base" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Basic analytics dashboard" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                    </List>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button
                                    onClick={() => this.props.subscriptionsHandler("100")}
                                    variant="contained"
                                    sx={{ width: "100%", textTransform: "capitalize", fontWeight: 700, backgroundColor: "black", fontSize: "18px" }}
                                >
                                    choose standard plan
                                </Button>
                            </CardActions>
                        </Card>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 px-2">
                        <Card className="CardHeight">
                            <CardContent>
                                <Stack direction={"column"} sx={{ gap: "0px", marginBottom: "20px" }}>
                                    <Typography variant="h5" sx={{ color: "black", fontWeight: 700 }}>
                                        Premium
                                    </Typography>
                                    <Typography variant="subtitle1" component="span" sx={{ color: "#71717a" }}>
                                        Best value for long-term
                                    </Typography>
                                </Stack>
                                <Stack direction={"column"} gap={1} sx={{ marginBottom: "20px" }}>
                                    <Typography variant="h4" sx={{ color: "black", fontWeight: 800 }}>
                                        ₹150
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: "black", fontWeight: 700, fontSize: "20px" }}>
                                        for 3 months
                                    </Typography>
                                </Stack>
                                <Box>
                                    <List>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Full access to chat service for 1 month" />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="24/7 chat availability" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Unlimited messages per day" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Full chatbot customization and AI training" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Priority phone, email, and chat support" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Access to exclusive knowledge base and resources
"
                                                sx={{ color: "#09090b" }}
                                            />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Advanced analytics and reporting" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemIcon sx={{ minWidth: "35px" }}>
                                                <CheckIcon sx={{ color: "green" }} />
                                            </ListItemIcon>
                                            <ListItemText primary="API access for custom integrations" sx={{ color: "#09090b" }} />
                                        </ListItem>
                                    </List>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Button
                                    onClick={() => this.props.subscriptionsHandler("150")}
                                    variant="outlined"
                                    sx={{ width: "100%", textTransform: "capitalize", fontWeight: 700, color: "black", fontSize: "18px", border: "2px solid black" }}
                                >
                                    choose premium plan
                                </Button>
                            </CardActions>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

export default Subscription;
