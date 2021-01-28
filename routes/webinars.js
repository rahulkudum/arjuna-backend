const router = require("express").Router();
let Webinar = require("../models/webinar.model");

router.route("/").get((req, res) => {
 Webinar.find()
  .then((webinars) => res.json(webinars))
  .catch((err) => console.log(err));
});

router.route("/add").post((req, res) => {
 const name = req.body.name;

 const newWebinar = new Webinar({
  name,
 });

 newWebinar
  .save()
  .then(() => res.json("sucessfully saved the new webinar"))
  .catch((err) => console.log(err));
});

module.exports = router;
