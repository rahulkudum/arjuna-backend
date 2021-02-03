const router = require("express").Router();
let User = require("../models/user.model");
let Webinar = require("../models/webinar.model");
router.route("/").get((req, res) => {
 User.find()
  .then((users) => res.json(users))
  .catch((err) => console.log(err));
});

router.route("/add").post((req, res) => {
 const name = req.body.name;
 const number = Number(req.body.number);
 const school = req.body.school;
 const webinars = [{ name: req.body.webinarname, speaker: req.body.webinarspeaker }];
 const webinarscount = 1;

 const newUser = new User({
  number,
  name,
  school,
  webinars,
  webinarscount,
 });

 newUser
  .save()
  .then((resp) => {
   Webinar.findOne({ name: req.body.webinarname, speaker: req.body.webinarspeaker }).then((webinar) => {
    webinar.users.push({ name: req.body.name, number: req.body.number });
    webinar
     .save()
     .then((response) => res.json("sucessfully saved the new user"))
     .catch((err) => console.log(err));
   });
  })
  .catch((err) => console.log(err));
});

router.route("/find").post((req, res) => {
 User.findOne({ number: Number(req.body.number) }, (err, file) => {
  if (!err) res.json(file);
  else res.send(err);
 });
});

router.route("/search").post((req, res) => {
 User.find(req.body.query, (err, files) => {
  if (!err) res.json(files);
  else res.send(err);
 });
});

router.route("/webinaradd").post((req, res) => {
 Webinar.findOne({ name: req.body.webinarname, speaker: req.body.webinarspeaker })
  .then((webinar) => {
   let found = false;
   webinar.users.map((val, i) => {
    if (val.number === req.body.number) {
     found = true;
    }
   });

   if (!found) {
    webinar.users.push({ name: req.body.name, number: req.body.number });
    webinar.userscount = webinar.users.length;
    webinar
     .save()
     .then((resp) => {
      User.findOne({ number: Number(req.body.number) }).then((user) => {
       user.webinars.push({ name: req.body.webinarname, speaker: req.body.webinarspeaker });
       user.webinarscount = user.webinars.length;
       user
        .save()
        .then((response) => res.json("sucessfully saved the new user"))
        .catch((err) => console.log(err));
      });
     })
     .catch((err) => console.log(err));
   } else res.send("");
  })
  .catch((err) => console.log(err));
});

router.route("/delete").post((req, res) => {
 User.deleteOne({ number: req.body.number }, (err) => {
  if (!err) res.send("sucessfully deleted");
  else res.send(err);
 });
});

module.exports = router;
