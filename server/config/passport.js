const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const { user } = require("../models");
const dotenv = require("dotenv");
dotenv.config();
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").user;
const GoolgeUser = require("../models").googleUser;

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt"); //固定寫法
  opts.secretOrKey = process.env.PASSPORT_SECRET;

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      console.log("進入JwtStrategy,以下為進入者:");
      console.log(jwt_payload);
      try {
        let foundUser;
        if (jwt_payload.userType) {
          foundUser = await GoolgeUser.findOne({
            _id: jwt_payload._id,
          }).exec(); //jwt_payload._id來找資料庫的使用者是誰
        } else {
          foundUser = await User.findOne({
            _id: jwt_payload._id,
          }).exec(); //jwt_payload._id來找資料庫的使用者是誰
        }
        if (foundUser) {
          // console.log("foundUser成功");
          return done(null, foundUser); // req.user <= foundUser 使用者成功通過驗證策略,通常會將相關的使用者資訊放入 req.user
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
