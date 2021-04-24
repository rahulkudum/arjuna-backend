const router = require("express").Router();
let Pwebinar = require("../models/pwebinar.model");

router.route("/").get((req, res) => {
 Pwebinar.find()
  .then((webinars) => res.json(webinars))
  .catch((err) => console.log(err));
});

router.route("/find").post((req, res) => {
 Pwebinar.findById(req.body.webinarid, (err, file) => {
  if (!err) res.json(file);
  else res.send(err);
 });
});

router.route("/add").post((req, res) => {
 const name = req.body.name;
 const description = req.body.description;
 const level = req.body.level;
 const webinarinstances = [];

 const newWebinar = new Pwebinar({
  name,
  description,
  level,
  webinarinstances,
 });

 newWebinar
  .save()
  .then((resp) => res.json(resp))
  .catch((err) => console.log(err));
});

router.route("/delete").post((req, res) => {
 Pwebinar.findByIdAndDelete(req.body.id, (err) => {
  if (!err) res.send("sucessfully deleted");
  else res.send(err);
 });
});

module.exports = router;
