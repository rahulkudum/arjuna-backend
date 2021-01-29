const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const webinarSchema = new Schema(
 {
  name: {
   type: String,
   required: true,
  },
  speaker: {
   type: String,
   required: true,
  },
  users: {
   type: Array,
   required: true,
  },
 },
 { timestamps: true }
);

const Webinar = mongoose.model("Webinar", webinarSchema);

module.exports = Webinar;
