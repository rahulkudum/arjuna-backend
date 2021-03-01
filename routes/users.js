const router = require("express").Router();
let User = require("../models/user.model");
let Webinar = require("../models/webinar.model");
router.route("/").get((req, res) => {
 User.find()
  .then((users) => res.json(users))
  .catch((err) => console.log(err));
});

router.route("/import").get((req, res) => {
 User.updateMany({ lastcontact: "" }, { webinars: [], courses: [], webinarscount: 0, coursescount: 0 }, { multi: true }, (error, resp) => {
  if (!error) res.send("sucessfully");
  else res.send(error);
 });
});

router.route("/add").post((req, res) => {
 const name = req.body.name;
 const number = Number(req.body.number);
 const email = req.body.email;
 const dob = req.body.dob;
 const gender = req.body.gender;
 const webinars = [{ id: req.body.webinarid, name: req.body.webinarname }];
 const webinarscount = 1;

 const newUser = new User({
  number,
  name,
  email,
  dob,
  gender,
  beyr10: "",
  beyr12: "",
  eeyr: "",
  educationid: "",
  volunteerwork: "",
  arjunapoc: "",
  communicationmethod: "",
  subscriptionstatus: "",
  lastcontact: "",
  courses: [],
  coursescount: 0,
  webinars,
  webinarscount,
 });

 newUser
  .save()
  .then((resp) => {
   Webinar.findById(req.body.webinarid).then((webinar) => {
    webinar.users.push({ id: resp._id, name: resp.name });
    webinar.userscount = webinar.users.length;
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
router.route("/findbyid").post((req, res) => {
 User.findById(req.body.id, (err, file) => {
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

router.route("/update").post((req, res) => {
 User.updateMany(req.body.query, req.body.update, { multi: true }, (err, files) => {
  if (!err) res.json(files);
  else res.send(err);
 });
});

router.route("/webinaradd").post((req, res) => {
 Webinar.findById(req.body.webinarid)
  .then((webinar) => {
   let found = false;
   webinar.users.map((val, i) => {
    if (val.id === req.body.id) {
     found = true;
    }
   });

   if (!found) {
    User.findById(req.body.id)
     .then((user) => {
      user.webinars.push({ id: req.body.webinarid, name: webinar.name });
      user.webinarscount = user.webinars.length;
      user.save().then((resp) => {
       webinar.users.push({ id: req.body.id, name: user.name });
       webinar.userscount = webinar.users.length;
       webinar
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
 User.findByIdAndDelete(req.body.id, (err) => {
  if (!err) res.send("sucessfully deleted");
  else res.send(err);
 });
});

module.exports = router;
