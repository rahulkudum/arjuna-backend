const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pwebinarSchema = new Schema({
 name: String,
 description: String,
 level: String,
 webinarinstances: Array,
});

const Pwebinar = mongoose.model("Webinar", pwebinarSchema);

module.exports = Pwebinar;
