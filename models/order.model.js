const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
 orderid: String,
 name: String,
 books: String,
 amount: String,
 phno: String,
 email: String,
 date: String,
 address: String,
 process: Boolean,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
