const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  id: { type: String },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId, // mongoose 內建的primary key
    refPath: "instructorModel", // 意思是指連結到Model裡面的"User"
  },
  instructorModel: {
    type: String,
    required: true,
    enum: ["User", "GoogleUser"],
  },
  students: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Course", courseSchema);

// const courseSchema = new Schema({
//   id: { type: String },
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   instructor: {
//     type: mongoose.Schema.Types.ObjectId, // mongoose 內建的primary key
//     ref: "User", // 意思是指連結到Model裡面的"User"
//   },

//   students: {
//     type: [String],
//     default: [],
//   },
// });
