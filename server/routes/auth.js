const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const GoolgeUser = require("../models").googleUser;
const jwt = require("jsonwebtoken");
const passport = require("passport");

// middleware
router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的請求");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("成功連結auth route!!");
});

router.post("/profile", async (req, res) => {
  // console.log(req.body);
  try {
    const result = await GoolgeUser.updateOne(
      { email: req.body.email },
      { $set: { role: req.body.role } }
    );
    return res.send("驗證成功 有此使用者!");
  } catch (e) {
    return res.status(500).send("無法儲存使用者。。。");
  }
});

router.post("/register", async (req, res) => {
  // console.log(registerValidation(req.body));
  // return res.send("註冊使用者頁面");
  // 確認數據是否符合規範
  let { error } = registerValidation(req.body); //進行解構付值,若有值error就會變成true
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    console.log("registerValidation 驗證成功");
  }

  // 確認信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("此信箱已被註冊過了。。。");

  // 製作新用戶
  let { username, email, password, role } = req.body;
  let newUser = new User({ username, email, password, role });
  console.log({
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
  });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "使用者成功儲存!",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("無法儲存使用者。。。");
  }
});

// 註冊及驗證OAuth
router.post("/google", async (req, res) => {
  let userInfo = req.body.userInfo;
  let message;
  let token;
  let user;
  // 確認信箱是否已註冊
  const emailExist = await GoolgeUser.findOne({ email: userInfo.email });
  if (emailExist) {
    console.log("GoogleUser已存在");
    message = "GoogleUser已存在";
    token = generateToken(emailExist);
    user = emailExist;
  } else if (!emailExist) {
    console.log("GoogleUser尚未註冊");
    message = "GoogleUser尚未註冊";
    let { name, email } = userInfo;
    let username = name;
    let newUser = new GoolgeUser({ username, email });
    try {
      let savedUser = await newUser.save();
      token = generateToken(savedUser);
      user = savedUser;
      message = "Google使用者成功儲存!";
    } catch (e) {
      console.error(e);
      return res.status(500).send("無法儲存使用者。。。");
    }
  }
  return res.send({ message, token, user });
});

function generateToken(user) {
  const tokenObject = {
    _id: user._id,
    email: user.email,
    userType: user.userType,
  };
  return "JWT " + jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
}

router.post("/login", async (req, res) => {
  // 確認數據是否符合規範
  let { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    console.log("loginValidation 驗證成功");
  }

  // 確認信箱是否已註冊
  const fundUser = await User.findOne({ email: req.body.email });
  if (!fundUser) {
    return res.status(401).send("無法找到使用者。請確認信箱");
  }

  // 正在放入一個回調函式(非宣告在外面的函式)
  fundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err); //err若收到null的話是false,所以就不會執行此行
    // (isMatch)去判斷是因為如果compare出來密碼不合,cb(e,result)中的result就會無法顯示，於布林值來說是false
    // 而如果compare出來密碼一致，則cb(null,result)裡的result就會顯示，於布林值來說是true
    if (isMatch) {
      // 製作json web token
      const tokenObject = { _id: fundUser._id, email: fundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      console.log("使用者成功登入!");
      return res.send({
        message: "成功登入",
        token: "JWT " + token, // JWT 後面一定要+空白鍵,不然會有BUG
        user: fundUser,
      });
    } else {
      console.log("使用者密碼錯誤");
      return res.status(401).send("密碼錯誤");
    }
  });
});

module.exports = router;

/**
 * JWT（JSON Web Token）通常包含一個"exp"（過期）的字段，表示該令牌的有效期限
 * 前端使用 jwt.sign 方法生成 JWT 時，你可以設定過期時間，確保該令牌在一段時間後失效
 * 設定過期時間為一小時
 */
// const jwt = require('jsonwebtoken');
// const tokenObject = { /* your token data */ };
// const secretKey = process.env.PASSPORT_SECRET;

// const token = jwt.sign(tokenObject, secretKey, { expiresIn: '1h' });
