const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((req, res) => {
 User.find()
  .then((users) => res.json(users))
  .catch((err) => console.log(err));
});

router.route("/add").post((req, res) => {
 const name = req.body.name;
 const number = req.body.number;
 const webinars = req.body.webinars;

 const newUser = new User({
  number,
  name,
  webinars,
 });

 newUser
  .save()
  .then(() => res.json("sucessfully saved the new user"))
  .catch((err) => console.log(err));
});

module.exports = router;
