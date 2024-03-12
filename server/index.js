const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport); // config/passport裡面有function,後面括號可以直接執行function,接著直接把上面的passport都進去
const cors = require("cors");

// const CONNECTION_URL = process.env.CONNECTION_KEY;
// 連結MongoDB
// **local**
mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("連結到MongoDB..");
  })
  .catch((e) => {
    console.log(e);
  });

// **Cloud**
// mongoose
//   .connect(CONNECTION_URL)
//   .then(() => {
//     console.log("連結到MongoDB..");
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRoute);
// course routeu應該被jwt保護
// 如果request header內部沒有jwt ，則request就會被視為unauthorized
app.use(
  "/api/courses",
  //這個中間件跑進去require("./config/passport")(passport);這裡面執行
  // authenticate->會使用JwtStrategy
  passport.authenticate("jwt", { session: false }), //false 表示在驗證成功不建立 session
  courseRoute
);

app.get("/test", (req, res) => {
  res.json({
    message: "test work is ok!!",
  });
});

// 只有登入系統的人,才能夠新增課程或是註冊課程

app.listen(8080, () => {
  console.log("後端伺服器聆聽在port 8080");
});
