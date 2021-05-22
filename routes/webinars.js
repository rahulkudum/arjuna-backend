const router = require("express").Router();
let Webinar = require("../models/webinar.model");
let User = require("../models/user.model");
let Pwebinar = require("../models/pwebinar.model");
let Wa = require("../models/wa.model");
const wbm = require("./wa.js");
const nodemailer = require("nodemailer");
let ical = require("ical-generator");

router.route("/").get((req, res) => {
 Webinar.find()
  .then((webinars) => res.json(webinars))
  .catch((err) => console.log(err));
});

router.route("/add").post((req, res) => {
 const webinarid = req.body.webinarid;
 const speaker = req.body.speaker;
 const date = req.body.date;
 const guest = req.body.guest;
 const institute = req.body.institute;
 const image = req.body.image;
 const users = [];
 const userscount = 0;

 const newWebinar = new Webinar({
  webinarid,
  speaker,
  date,
  guest,
  institute,
  image,
  users,
  userscount,
 });

 newWebinar
  .save()
  .then((resp) => {
   res.json(resp);
  })
  .catch((err) => console.log(err));
});

router.route("/find").post((req, res) => {
 Webinar.findById(req.body.webinarid, (err, file) => {
  if (!err) res.json(file);
  else res.send(err);
 });
});

router.route("/search").post((req, res) => {
 Webinar.find(req.body.query, (err, files) => {
  if (!err) res.json(files);
  else res.send(err);
 });
});

router.route("/update").post((req, res) => {
 Webinar.updateMany(req.body.query, req.body.update, { multi: true }, (err, files) => {
  if (!err) res.json(files);
  else res.send(err);
 });
});

router.route("/addusers").post((req, res) => {
 const id = req.body.id;
 const wid = req.body.wid;
 const eid = req.body.eid;
 const details = req.body.details;

 Pwebinar.findById(wid).then((pwebinar) => {
  pwebinar.webinarinstances.push(id);
  pwebinar
   .save()
   .then(() => {
    let i = 0;
    let j = 0;

    details.map((val, k) => {
     User.findOne({ number: Number(val[0]) }, (err, user) => {
      if (!err) {
       if (user) {
        Webinar.findById(id)
         .then((webinar) => {
          let found = false;
          webinar.users.map((val2) => {
           console.log(val2, user._id);
           if (JSON.stringify(val2) === JSON.stringify(user._id)) {
            console.log("found");
            found = true;
           }
          });

          if (!found) {
           user.webinars.push(id);
           user.webinarscount = user.webinars.length;
           if (user.email === "" && val[3] !== "") {
            user.email = val[3];
           }
           if (user.gender === "" && val[2] !== "") {
            user.gender = val[2];
           }
           user.save().then(() => {
            webinar.users.push(user._id);
            webinar
             .save()
             .then(() => {
              // console.log("success");
              i++;
              if (i + j === details.length) {
               console.log(i, j);
               Webinar.findById(id)
                .then((webin) => {
                 webin.userscount = webin.users.length;
                 console.log(webin.userscount);
                 webin
                  .save()
                  .then(() => {
                   res.send("completed");
                  })
                  .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
              }
             })
             .catch((err) => console.log(err));
           });
          } else {
           console.log("duplicate user");
           i++;
           if (i + j === details.length) {
            console.log(i, j);

            Webinar.findById(id)
             .then((webin) => {
              webin.userscount = webin.users.length;
              console.log(webin.userscount);
              webin
               .save()
               .then(() => {
                res.send("completed");
               })
               .catch((err) => console.log(err));
             })
             .catch((err) => console.log(err));
           }
          }
         })
         .catch((err) => console.log(err));
       } else {
        const name = val[1];
        const number = Number(val[0]);
        const email = val[3];
        const gender = val[2];
        const educationid = eid;
        const webinars = [id];
        const webinarscount = 1;

        const newUser = new User({
         number,
         name,
         email,
         dob: "",
         gender,
         beyr10: "",
         beyr12: "",
         eeyr: "",
         educationid,
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
          Webinar.findById(id).then((webinar) => {
           webinar.users.push(resp._id);
           webinar
            .save()
            .then(() => {
             //  console.log("Success 2");
             j++;
             if (i + j === details.length) {
              console.log(i, j);
              Webinar.findById(id)
               .then((webin) => {
                webin.userscount = webin.users.length;
                // console.log(webin.userscount);
                webin
                 .save()
                 .then(() => {
                  res.send("completed");
                 })
                 .catch((err) => console.log(err));
               })
               .catch((err) => console.log(err));
             }
            })
            .catch((err) => console.log(err));
          });
         })
         .catch((err) => console.log(err));
       }
      } else {
       console.log(err);
      }
     });
    });
   })
   .catch((err) => console.log(err));
 });
});

router.route("/userdelete").post((req, res) => {
 Webinar.findById(req.body.webinarid)
  .then((webinar) => {
   webinar.users = webinar.users.filter((user) => user != req.body.id);
   webinar.userscount = webinar.users.length;
   webinar
    .save()
    .then((resp) => {
     User.findById(req.body.id).then((user) => {
      if (!user) res.send("sucessfully deleted the user fot this webinar");
      else {
       user.webinars = user.webinars.filter((webinar) => webinar != req.body.webinarid);
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

router.route("/wa").get((req, res) => {
 const msg = req.query.msg;
 const id = req.query.webinarid;
 let contacts = [];

 Webinar.findById(id).then((webinar) => {
  Pwebinar.findById(webinar.webinarid).then((pwebinar) => {
   webinar.users.map((val, i) => {
    User.findById(val).then((student) => {
     contacts.push({
      phone: "91" + student.number,
      name: student.name,
      webinar: pwebinar.name,
      date: webinar.date,
      speaker: webinar.speaker,
      guest: webinar.guest,
     });
     if (i === webinar.users.length - 1) {
      wbm
       .start({ qrCodeData: true, session: false })
       .then(async (qrCodeData) => {
        console.log(qrCodeData);
        res.setHeader("Content-Type", "text/event-stream");
        res.write("data: " + JSON.stringify(qrCodeData) + "\n\n");
        let scanned = true;
        scanned = await wbm.waitQRCode();
        if (scanned) {
         for (let contact of contacts) {
          result = await wbm.sendTo(contact, msg);
          res.write("data: " + JSON.stringify(result) + "\n\n");
         }
        }
        finalresult = await wbm.end();
        res.write("data: " + JSON.stringify(finalresult) + "\n\n");
       })
       .catch((err) => {
        console.log(err);
       });
     }
    });
   });
  });
 });
});

router.route("/email").get((req, res) => {
 let details = JSON.parse(req.query.details);
 const id = req.query.webinarid;
 let contacts = [];

 Webinar.findById(id).then((webinar) => {
  Pwebinar.findById(webinar.webinarid).then((pwebinar) => {
   webinar.users.map((val, i) => {
    User.findById(val).then((student) => {
     contacts.push({
      email: student.email,
      name: student.name,
      webinar: pwebinar.name,
      date: webinar.date,
      speaker: webinar.speaker,
      guest: webinar.guest,
     });
     if (i === webinar.users.length - 1) {
      const calendar = ical({ name: "testing cal name", description: "testing cal description" });
      if (details.calendar) {
       const event = calendar.createEvent({
        start: new Date(details.calendar.date + "T" + details.calendar.stime),
        end: new Date(details.calendar.date + "T" + details.calendar.etime),
        summary: details.calendar.title,
        description: details.calendar.description,
        location: details.calendar.location,
       });
      }

      let transporter = nodemailer.createTransport({
       service: details.service,
       auth: {
        user: details.emailid,
        pass: details.password,
       },
      });
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Access-Control-Allow-Origin", "*");
      let count = 0;
      for (let contact of contacts) {
       for (let property in contact) {
        details.subject = details.subject.replace(new RegExp(`{{${property}}}`, "g"), contact[property]);
        details.body = details.body.replace(new RegExp(`{{${property}}}`, "g"), contact[property]);
       }
       let mailOptions = {
        from: details.emailid,
        to: contact.email,
        subject: details.subject,
        text: details.body,
       };

       if (details.calendar) {
        mailOptions.icalEvent = {
         filename: "webinar.ics",
         method: "publish",
         content: calendar.toString(),
        };
       }
       if (details.attachments.length !== 0) {
        mailOptions.attachments = [];
        for (let attachment of details.attachments) {
         mailOptions.attachments.push({ path: attachment });
        }
       }

       transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
         console.log(err);
         res.send(err);
        } else {
         console.log(data);
         if (data.accepted.length > 0) {
          res.write("data: " + JSON.stringify("success" + contact.email + "-" + contact.name) + "\n\n");
         } else {
          res.write("data: " + JSON.stringify("fail" + contact.email + "-" + contact.name) + "\n\n");
         }
         if (count === contacts.length - 1) {
          res.write("data: " + JSON.stringify("Result") + "\n\n");
         }
        }
        count++;
       });
      }
     }
    });
   });
  });
 });
});

router.route("/ical").get((req, res) => {
 const calendar = ical({ name: "testing cal name", description: "testing cal description" });
 const event = calendar.createEvent({
  start: new Date(),
  summary: "testing event name",
  description: "test event description",
  location: "ZOOM",
 });
 event.allDay(true);
 console.log(calendar.toString());
 calendar.serve(res);
});

router.route("/delete").post((req, res) => {
 Webinar.findByIdAndDelete(req.body.id, (err) => {
  if (!err) res.send("sucessfully deleted");
  else res.send(err);
 });
});

module.exports = router;
