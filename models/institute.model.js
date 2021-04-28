const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const instituteSchema = new Schema({
 name: String,
 campus: String,
 location: String,
 inumber: String,
 imail: String,
 pnumber: String,
 pmail: String,
 poc: String,
});

const Institute = mongoose.model("Institute", instituteSchema);

module.exports = Institute;
