const router = require("express").Router();
let Book = require("../models/book.model");

router.route("/").get((req, res) => {
 Book.find()
  .then((books) => res.json(books))
  .catch((err) => console.log(err));
});

router.route("/add").post((req, res) => {
 const name = req.body.name;
 const price = req.body.price;
 const image = req.body.image;
 const newBook = new Book({
  name,
  price,
  image,
 });

 newBook
  .save()
  .then((resp) => res.json(resp))
  .catch((err) => console.log(err));
});

router.route("/delete").post((req, res) => {
 Book.findByIdAndDelete(req.body.id, (err) => {
  if (!err) res.send("sucessfully deleted");
  else res.send(err);
 });
});

module.exports = router;
