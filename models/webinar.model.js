const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const webinarSchema = new Schema({
 webinarid: String,
 speaker: String,
 date: String,
 time: String,
 guest: String,
 institute: String,
 image: String,
 users: Array,
 userscount: Number,
});

const Webinar = mongoose.model("WebinarInstance", webinarSchema);

module.exports = Webinar;
