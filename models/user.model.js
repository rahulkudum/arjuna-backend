const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
 name: String,
 number: Number,
 email: String,
 gender: String,
 dob: String,
 eyr10b: Number,
 eyr12b: Number,
 eyre: Number,
 educationid: String,
 webinars: Array,
 courses: Array,
 volunteerwork: String,
 arjunapoc: String,
 communicationmethod: String,
 subscriptionstatus: String,
 lastcontact: String,
 webinarscount: Number,
 coursescount: Number,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
