const router = require("express").Router();
let Webinar = require("../models/webinar.model");
let User = require("../models/user.model");
let Pwebinar = require("../models/pwebinar.model");

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

router.route("/delete").post((req, res) => {
 Webinar.findByIdAndDelete(req.body.id, (err) => {
  if (!err) res.send("sucessfully deleted");
  else res.send(err);
 });
});

module.exports = router;
