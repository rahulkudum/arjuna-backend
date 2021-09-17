const router = require("express").Router();
let Book = require("../models/book.model");

router.route("/").get((req, res) => {
 Book.find()
  .then((books) => res.json(books))
  .catch((err) => console.log(err));
});

router.route("/add").post((req, res) => {
 const title = req.body.title;
 const image = req.body.image;
 const newBook = new Book({
  title,
  subtitle: "",
  description: "",
  chapters: [],
  testimonials: [],
  price: 0,
  image,
 });

 newBook
  .save()
  .then((resp) => res.json(resp))
  .catch((err) => console.log(err));
});

router.route("/modify").post((req, res) => {
 Book.findById(req.body.book._id)
  .then((book) => {
   console.log(book);
   book.title = req.body.book.title;
   book.subtitle = req.body.book.subtitle;
   book.description = req.body.book.description;
   book.chapters = req.body.book.chapters;
   book.testimonials = req.body.book.testimonials;
   book.price = Number(req.body.book.price);
   book.image = req.body.book.image;
   console.log(book.price);
   book
    .save()
    .then(() => {
     res.json("sucessfully modified the book");
    })
    .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
});

router.route("/find").post((req, res) => {
 Book.findOne({ title: req.body.name }, (err, file) => {
  if (!err) res.json(file);
  else res.send(err);
 });
});

router.route("/delete").post((req, res) => {
 Book.findByIdAndDelete(req.body.id, (err) => {
  if (!err) res.send("sucessfully deleted");
  else res.send(err);
 });
});

module.exports = router;