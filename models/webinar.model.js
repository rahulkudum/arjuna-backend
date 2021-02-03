const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const webinarSchema = new Schema({
 name: String,
 speaker: String,
 users: Array,
 userscount: Number,
});

const Webinar = mongoose.model("Webinar", webinarSchema);

module.exports = Webinar;
