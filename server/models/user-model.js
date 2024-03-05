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

// instance methods
userSchema.methods.isStudent = function () {
  return this.role == "student";
};

userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

userSchema.methods.comparePassword = async function (password, cb) {
  let result = await bcrypt.compare(password, this.password);

  return cb(null, result);
};

// mongoose middlewares
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

module.exports = mongoose.model("User", userSchema);

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
