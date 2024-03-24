const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const googleGserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  role: {
    type: String,
    enum: ["student", "instructor", ""],
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userType: {
    type: String,
    default: "google",
  },
});

// instance methods
/**
 * 它是在使用者模型(User model)的實例上呼叫的
 * 例如，如果你有一個使用者物件 const user = new User({ user data });
 * 然後可以使用 user.isStudent() 來檢查該使用者是否是學生
 */
userSchema.methods.isStudent = function () {
  console.log("進行isStudent驗證");
  return this.role == "student";
};

googleGserSchema.methods.isStudent = function () {
  console.log("進行isStudent驗證");
  return this.role == "student";
};

userSchema.methods.isInstructor = function () {
  console.log("進行isInstructor驗證");
  return this.role == "instructor";
};

googleGserSchema.methods.isInstructor = function () {
  console.log("進行isInstructor驗證");
  return this.role == "instructor";
};

userSchema.methods.comparePassword = async function (password, cb) {
  console.log("進行comparePassword驗證");
  let result;
  try {
    result = await bcrypt.compare(password, this.password); //會回傳一個包含雜湊後的密碼的字串
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

// mongoose middlewares
/**
 * 這是一個在保存(save)使用者模型到資料庫之前(pre-save)執行的中介軟體(middleware)或者稱為"pre-hook"。
 * 它在每次儲存(save)使用者模型之前被呼叫
 */
// 若使用者為新用戶，或者是正在更改密碼，則將密碼進行雜湊處理
userSchema.pre("save", async function (next) {
  // this.isNew是mongoose內建的功能,如果是全新的 isNew就是true
  // this.isModified 檢查某個字段是否被修改過
  if (this.isNew || this.isModified("password")) {
    // 其中一個是true就要將密碼進行雜湊處理
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = {
  User: mongoose.model("User", userSchema),
  GoogleUser: mongoose.model("GoogleUser", googleGserSchema),
};

// pre範例
// userSchema.pre('save', async function (next) {
//     // 在保存文檔之前執行的函數
//   });

//   userSchema.pre('deleteOne', async function (next) {
//     // 在刪除文檔之前執行的函數
//   });

// 測試 instance methods
// const User = mongoose.model("User", userSchema);

// const user = new User({
//   username: "JohnDoe",
//   email: "john@example.com",
//   password: "securepassword",
//   role: "student",
// });

// console.log(user.isStudent()); // 將輸出 true
