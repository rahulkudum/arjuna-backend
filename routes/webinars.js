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
 const date = req.body.date;
 const guest = req.body.guest;
 const description = req.body.description;
 const users = [];
 const userscount = 0;

 const newWebinar = new Webinar({
  name,
  speaker,
  date,
  guest,
  description,
  users,
  userscount,
 });

 newWebinar
  .save()
  .then(() => res.json("sucessfully saved the new webinar"))
  .catch((err) => console.log(err));
});

router.route("/find").post((req, res) => {
 Webinar.findById(req.body.webinarid, (err, file) => {
  if (!err) res.json(file);
  else res.send(err);
 });
});

router.route("/userdelete").post((req, res) => {
 Webinar.findById(req.body.webinarid)
  .then((webinar) => {
   webinar.users = webinar.users.filter((user) => user.id != req.body.id);
   webinar.userscount = webinar.users.length;
   webinar
    .save()
    .then((resp) => {
     User.findById(req.body.id).then((user) => {
      if (!user) res.send("sucessfully deleted the user fot this webinar");
      else {
       user.webinars = user.webinars.filter((webinar) => webinar.id != req.body.webinarid);
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
 Webinar.findByIdAndDelete(req.body.id, (err) => {
  if (!err) res.send("sucessfully deleted");
  else res.send(err);
 });
});

module.exports = router;
