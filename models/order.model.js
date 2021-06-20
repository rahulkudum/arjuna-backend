const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
 name: String,
 book: String,
 amount: String,
 phno: String,
 email: String,
 date: Date,
 address: String,
 process: Boolean,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
