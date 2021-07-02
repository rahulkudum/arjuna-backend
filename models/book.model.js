const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
 name: String,
 price: Number,
 image: String,
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
