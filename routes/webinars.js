const router = require("express").Router();
let Webinar = require("../models/webinar.model");
let User = require("../models/user.model");

router.route("/").get((req, res) => {
 Webinar.find()
  .then((webinars) => res.json(webinars))
  .catch((err) => console.log(err));
});

router.route("/add").post((req, res) => {
 const name = req.body.name;
 const speaker = req.body.speaker;
 const users = [];
 const userscount = 0;

 Webinar.find({ name: name, speaker: speaker }).then((resp) => {
  if (!resp) {
   const newWebinar = new Webinar({
    name,
    speaker,
    users,
    userscount,
   });

   newWebinar
    .save()
    .then(() => res.json("sucessfully saved the new webinar"))
    .catch((err) => console.log(err));
  } else {
   res.send("");
  }
 });
});

router.route("/find").post((req, res) => {
 Webinar.findOne({ name: req.body.name, speaker: req.body.speaker }, (err, file) => {
  if (!err) res.json(file);
  else res.send(err);
 });
});

router.route("/userdelete").post((req, res) => {
 Webinar.findOne({ name: req.body.webinarname, speaker: req.body.webinarspeaker })
  .then((webinar) => {
   webinar.users = webinar.users.filter((user) => user.number != req.body.number);
   webinar.userscount = webinar.users.length;
   webinar
    .save()
    .then((resp) => {
     User.findOne({ number: req.body.number }).then((user) => {
      if (!user) res.send("sucessfully deleted the user fot this webinar");
      else {
       user.webinars = user.webinars.filter((webinar) => webinar.name != req.body.webinarname && webinar.speaker != req.body.webinarspeaker);
       user.webinarscount = user.webinars.length;
       user
        .save()
        .then((respo) => res.send("sucessfully deleted the user fot this webinar"))
        .catch((err) => console.log(err));
      }
     });
    })
    .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
});

router.route("/delete").post((req, res) => {
 Webinar.deleteOne({ name: req.body.name, speaker: req.body.speaker }, (err) => {
  if (!err) res.send("sucessfully deleted");
  else res.send(err);
 });
});

module.exports = router;
