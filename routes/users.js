const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((req, res) => {
 User.find()
  .then((users) => res.json(users))
  .catch((err) => console.log(err));
});

router.route("/add").post((req, res) => {
 const name = req.body.name;
 const number = Number(req.body.number);
 const school = req.body.school;
 const webinars = req.body.webinars;

 const newUser = new User({
  number,
  name,
  school,
  webinars,
 });

 newUser
  .save()
  .then(() => res.json("sucessfully saved the new user"))
  .catch((err) => console.log(err));
});

router.route("/find").post((req, res) => {
 User.findOne({ number: Number(req.body.number) }, (err, file) => {
  if (!err) res.json(file);
  else res.send(err);
 });
});

router.route("/webinaradd").post((req, res) => {
 User.updateOne({ number: Number(req.body.number) }, { webinars: req.body.webinars }, (err) => {
  if (!err) res.send("successfully updated this webinar for the user");
  else res.send(err);
 });
});

router.route("/delete").post((req, res) => {
 User.deleteOne({ number: req.body.number }, (err) => {
  if (!err) res.send("sucessfully deleted");
  else res.send(err);
 });
});

module.exports = router;
