const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes/v1");
const path = require("path");
const app = express();
require("dotenv").config();

app.use(cors());

mongoose
    .connect(process.env.MONGOURL)
    .then((res) => {
        console.log("Mongo Db is Connected");
    })
    .catch((err) => console.log(err));

app.use(express.json());
app.use("/v1", router);
app.use("/uploads", express.static(path.join(__dirname, "./Images")));
app.listen(process.env.PORT, () => {
    console.log(`Server is Running on ${process.env.PORT}`);
});
