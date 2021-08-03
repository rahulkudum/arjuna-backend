const router = require("express").Router();
let User = require("../models/user.model");
let Webinar = require("../models/webinar.model");
const nodemailer = require("nodemailer");
let ical = require("ical-generator");

router.route("/").get((req, res) => {
 User.find()
  .then((users) => res.json(users))
  .catch((err) => console.log(err));
});

router.route("/import").get((req, res) => {
 //  User.findById("603c9cea25e4ea42dc70f55f").then((user) => {
 //   user.webinars = [user.webinar[0]];
 //   user.webinarscount = 1;
 //   user.save(() => res.json("success")).catch((err) => console.log(err));
 //  });
});

router.route("/add").post((req, res) => {
 const name = req.body.name;
 const number = Number(req.body.number);
 const email = req.body.email;
 const dob = req.body.dob;
 const gender = req.body.gender;
 const role = req.body.role;
 const webinars = [req.body.webinarid];
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
  role,
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
    webinar.users.push(resp._id);
    webinar.userscount = webinar.users.length;
    webinar
     .save()
     .then((response) => res.json(resp))
     .catch((err) => console.log(err));
   });
  })
  .catch((err) => console.log(err));
});

router.route("/addadmin").post((req, res) => {
 const name = req.body.name;
 const number = Number(req.body.number);
 const email = req.body.email;
 const dob = req.body.dob;
 const gender = req.body.gender;
 const role = req.body.gender;

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
  role,
  communicationmethod: "",
  subscriptionstatus: "",
  lastcontact: "",
  courses: [],
  coursescount: 0,
  webinars: [],
  webinarscount: 0,
 });

 newUser
  .save()
  .then((resp) => {
   res.json(resp);
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
    if (JSON.stringify(val) === JSON.stringify(req.body.id)) {
     found = true;
    }
   });

   if (!found) {
    User.findById(req.body.id)
     .then((user) => {
      user.webinars.push(req.body.webinarid);
      user.webinarscount = user.webinars.length;
      user.save().then((resp) => {
       webinar.users.push(req.body.id);
       webinar.userscount = webinar.users.length;
       webinar
        .save()
        .then((response) => res.json(user))
        .catch((err) => console.log(err));
      });
     })
     .catch((err) => console.log(err));
   } else res.send("");
  })
  .catch((err) => console.log(err));
});

router.route("/updateadd").post((req, res) => {
 User.findById(req.body.id)
  .then((user) => {
   user.email = req.body.email;
   user.dob = req.body.dob;
   user.role = req.body.role;
   user.gender = req.body.gender;
   user
    .save()
    .then(() => {
     res.json("sucessfully saved the new user");
    })
    .catch((err) => console.log(err));
  })
  .catch((err) => console.log(err));
});

router.route("/sendemail").post((req, res) => {
 User.findById(req.body.userid)
  .then((user) => {
   Webinar.findById(req.body.webinarid)
    .then((webinar) => {
     const calendar = ical({ name: "testing cal name", description: "testing cal description" });

     const event = calendar.createEvent({
      start: new Date(webinar.date + "T" + webinar.time),
      end: new Date(webinar.date + "T" + webinar.time),
      summary: req.body.wname,
      description: "Arjuna Webinar",
      location: "Zoom",
     });

     let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
       type: "OAuth2",
       clientId: "526565895378-7ep38biscsl6s9c369ef1att91djcfin.apps.googleusercontent.com",
       clientSecret: "vIxbXFxBlUBX_ELVBaPnO6FG",
      },
     });

     transporter.on("token", (token) => {
      console.log("A new access token was generated");
      console.log("User: %s", token.user);
      console.log("Access Token: %s", token.accessToken);
      console.log("Expires: %s", new Date(token.expires));
     });

     let mailOptions = {
      from: "rahulkudum@gmail.com",
      to: user.email,
      subject: `Sucessfully registered for the ${req.body.wname} webinar`,
      text: `Hello ${user.name}!\n\nThank you for registering for the webinar!\n\nRespectfully,\nARJUNA Group Trust`,
      auth: {
       user: "rahulkudum@gmail.com",
       refreshToken: "1//04VuBYRmdXT1UCgYIARAAGAQSNwF-L9IrgzO6XvS9xBRqcioijQXjKlW_X3su7HrVyyteGruXj9dxGOfxKcFAcX6QceW3lnqHF1Q",
       accessToken:
        "ya29.a0ARrdaM-rc2swL1xsfJIWATGaIz8nNTdHWFjNEuIgYeioONN_YrTAg3Z-gkcjThyn3kUibN29MuWTU6RGZJHglAkOusl9Fl2I1cZIdoJ-fQbx2LoaXi4zcMz5XfjWgPLKXoJ3TGowza7dprSuwK16thcfChM7",
       expires: new Date().getTime(),
      },
     };

     mailOptions.icalEvent = {
      filename: "webinar.ics",
      method: "publish",
      content: calendar.toString(),
     };

     transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
       console.log(err);
       res.send(err);
      } else {
       res.json("sucessfully sent the mail");
      }
     });
    })
    .catch((err) => console.log(err));
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
