const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
 number: {
  type: Number,
  required: true,
  unique: true,
 },

 name: {
  type: String,
  required: true,
 },

 //   dob: {
 //    type: Date,
 //    required: true,
 //   },

 school: {
  type: String,
  required: true,
 },

 //   city: {
 //    type: String,
 //    required: true,
 //   },

 //   lastprogram: {
 //    type: Date,
 //    required: true,
 //   },

 //   noofprograms: {
 //    type: Number,
 //    required: true,
 //   },

 webinars: {
  type: Array,
  required: true,
 },

 //   courses: {
 //    type: Array,
 //    required: true,
 //   },

 //   volunteerhours: {
 //    type: Number,
 //    required: true,
 //   },

 //   arjunapoc: {
 //    type: String,
 //    required: true,
 //   },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
