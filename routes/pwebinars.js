const router = require("express").Router();
let Pwebinar = require("../models/pwebinar.model");
let Institute = require("../models/institute.model");

router.route("/").get((req, res) => {
 Pwebinar.find()
  .then((webinars) => res.json(webinars))
  .catch((err) => console.log(err));
});

router.route("/institutes").get((req, res) => {
 Institute.find()
  .then((institutes) => res.json(institutes))
  .catch((err) => console.log(err));
});

router.route("/find").post((req, res) => {
 Pwebinar.findById(req.body.webinarid, (err, file) => {
  if (!err) res.json(file);
  else res.send(err);
 });
});

router.route("/findinstitute").post((req, res) => {
 Institute.findById(req.body.instituteid, (err, file) => {
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

router.route("/addinstitute").post((req, res) => {
 const name = req.body.name;
 const campus = req.body.campus;
 const location = req.body.location;
 const inumber = req.body.inumber;
 const imail = req.body.imail;
 const pnumber = req.body.pnumber;
 const pmail = req.body.pmail;
 const poc = req.body.poc;

 const newInstitute = new Institute({
  name,
  campus,
  location,
  inumber,
  imail,
  pnumber,
  pmail,
  poc,
 });

 newInstitute
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
