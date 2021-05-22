const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const waSchema = new Schema({
 total: Number,
 sent: Number,
 failed: Number,
});

const Wa = mongoose.model("wa", waSchema);

module.exports = Wa;
