const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
 title: String,
 subtitle: String,
 description: String,
 chapters: Array,
 testimonials: Array,
 price: Number,
 image: String,
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
