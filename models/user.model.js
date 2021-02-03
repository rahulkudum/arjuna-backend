const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
 number: Number,
 name: String,
 school: String,
 webinars: Array,
 webinarscount: Number,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
