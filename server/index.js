const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;

// 連結MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("連結到MongoDB..");
  })
  .catch((e) => {
    console.log(e);
  });

// middleware
app.use(express.json());
app.use(express.urlencoded({ express: true }));

app.use("/api/user", authRoute);

app.listen(8080, () => {
  console.log("後端伺服器聆聽在port 8080");
});
