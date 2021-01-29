const router = require("express").Router();
let Webinar = require("../models/webinar.model");

router.route("/").get((req, res) => {
 Webinar.find()
  .then((webinars) => res.json(webinars))
  .catch((err) => console.log(err));
});

router.route("/add").post((req, res) => {
 const name = req.body.name;
 const speaker = req.body.speaker;
 const users = [];

 const newWebinar = new Webinar({
  name,
  speaker,
  users,
 });

 newWebinar
  .save()
  .then(() => res.json("sucessfully saved the new webinar"))
  .catch((err) => console.log(err));
});

router.route("/find").post((req, res) => {
 Webinar.findOne({ name: req.body.name, speaker: req.body.speaker }, (err, file) => {
  if (!err) res.json(file);
  else res.send(err);
 });
});

router.route("/useradd").post((req, res) => {
 Webinar.updateOne({ name: req.body.name, speaker: req.body.speaker }, { users: req.body.users }, (err) => {
  if (!err) res.send("successfully regiseterd the user for the webinar");
  else res.send(err);
 });
});

router.route("/delete").post((req, res) => {
 Webinar.deleteOne({ name: req.body.name, speaker: req.body.speaker }, (err) => {
  if (!err) res.send("sucessfully deleted");
  else res.send(err);
 });
});

module.exports = router;
