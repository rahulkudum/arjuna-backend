const router = require("express").Router();
let Order = require("../models/order.model");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
 key_id: "rzp_test_WQG7sTrp3IgCeQ",
 key_secret: "968V3t6qgs7EZ72McP1wx4gQ",
});

router.route("/").get((req, res) => {
 Order.find()
  .then((order) => res.json(order))
  .catch((err) => console.log(err));
});

router.route("/process").post((req, res) => {
 Order.findById(req.body.id)
  .then((order) => {
   let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
     type: "OAuth2",
     user: "rahulkudum@gmail.com",
     clientId: "526565895378-7ep38biscsl6s9c369ef1att91djcfin.apps.googleusercontent.com",
     clientSecret: "vIxbXFxBlUBX_ELVBaPnO6FG",
     refreshToken: "1//04_FOv5PdrJfDCgYIARAAGAQSNwF-L9IrYrndoS--3KXeoQWldfaJa5n88JjW1H1AxGl6A5cswCT5cmqBL3wl3sjPllxBbHdO2_U",
     accessToken:
      "ya29.a0AfH6SMC9bM3-D7owC5E_gAXNgLMWR45oJlWDbdO8DTuAohiTfV4l9XEtGWOSDpuse8LLXF9yYZ0ivZFsVp-39QJRmDEWWUXnDsfpIOe83ppNFyUPqCcBbVwwqgMhloMNCmYRs-G2kaakAdTOZA8P4Z8fa9Tm",
     expires: 3590,
    },
   });

   let mailOptions = {
    from: "rahulkudum@gmail.com",
    to: order.email,
    subject: "AOC book order is placed",
    text: "Your order is placed, you will be getting the book in 3-5 bussiness days",
   };

   transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
     res.send(err);
    } else {
     order.process = true;
     order
      .save()
      .then(() => {
       res.json("sucessfully processed the order");
      })
      .catch((err) => console.log(err));
    }
   });
  })
  .catch((err) => console.log(err));
});

router.route("/pay").post(async (req, res) => {
 const payment_capture = 1;
 const amount = 150;
 const currency = "INR";

 console.log(req);

 const response = await razorpay.orders.create({
  amount: (amount * 100).toString(),
  currency,
  receipt: Math.floor(Math.random() * 100000 + 1).toString(),
  payment_capture,
 });
 console.log(response);
 res.json({
  id: response.id,
  currency: "INR",
  amount: response.amount,
 });
});

router.route("/verify").post(async (req, res) => {
 // do a validation
 const secret = "12345678";

 console.log(req.body);

 const crypto = require("crypto");

 const shasum = crypto.createHmac("sha256", secret);
 shasum.update(JSON.stringify(req.body));
 const digest = shasum.digest("hex");

 console.log(digest, req.headers["x-razorpay-signature"]);

 if (digest === req.headers["x-razorpay-signature"]) {
  console.log("request is legit");
  const name = req.body.payload.payment.entity.notes.name;
  const email = req.body.payload.payment.entity.email;
  const phno = req.body.payload.payment.entity.contact;
  const date = new Date().toISOString().slice(0, 10);
  const book = req.body.payload.payment.entity.notes.book;
  const amount = req.body.payload.payment.entity.amount;
  const address = req.body.payload.payment.entity.notes.address;

  const newOrder = new Order({
   name,
   phno,
   email,
   date,
   book,
   amount,
   address,
  });

  newOrder
   .save()
   .then((resp) => console.log(resp))
   .catch((err) => console.log(err));

  let transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 465,
   secure: true,
   auth: {
    type: "OAuth2",
    user: "rahulkudum@gmail.com",
    clientId: "526565895378-7ep38biscsl6s9c369ef1att91djcfin.apps.googleusercontent.com",
    clientSecret: "vIxbXFxBlUBX_ELVBaPnO6FG",
    refreshToken: "1//04_FOv5PdrJfDCgYIARAAGAQSNwF-L9IrYrndoS--3KXeoQWldfaJa5n88JjW1H1AxGl6A5cswCT5cmqBL3wl3sjPllxBbHdO2_U",
    accessToken:
     "ya29.a0AfH6SMC9bM3-D7owC5E_gAXNgLMWR45oJlWDbdO8DTuAohiTfV4l9XEtGWOSDpuse8LLXF9yYZ0ivZFsVp-39QJRmDEWWUXnDsfpIOe83ppNFyUPqCcBbVwwqgMhloMNCmYRs-G2kaakAdTOZA8P4Z8fa9Tm",
    expires: 3590,
   },
  });

  let mailOptions = {
   from: "rahulkudum@gmail.com",
   to: email,
   subject: "AOC book order",
   text: "Thank for Purchasing AOC, we have sent a mail regardibg the order details",
  };

  transporter.sendMail(mailOptions, (err, data) => {
   if (err) {
    res.send(err);
   } else {
    res.send("sucess");
   }
  });
 } else {
  // pass it
 }
});

router.route("/dummy").post(async (req, res) => {
 let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
   type: "OAuth2",
   user: "rahulkudum@gmail.com",
   clientId: "526565895378-7ep38biscsl6s9c369ef1att91djcfin.apps.googleusercontent.com",
   clientSecret: "vIxbXFxBlUBX_ELVBaPnO6FG",
   refreshToken: "1//04_FOv5PdrJfDCgYIARAAGAQSNwF-L9IrYrndoS--3KXeoQWldfaJa5n88JjW1H1AxGl6A5cswCT5cmqBL3wl3sjPllxBbHdO2_U",
   accessToken:
    "ya29.a0AfH6SMC9bM3-D7owC5E_gAXNgLMWR45oJlWDbdO8DTuAohiTfV4l9XEtGWOSDpuse8LLXF9yYZ0ivZFsVp-39QJRmDEWWUXnDsfpIOe83ppNFyUPqCcBbVwwqgMhloMNCmYRs-G2kaakAdTOZA8P4Z8fa9Tm",
   expires: 3590,
  },
 });

 let mailOptions = {
  from: "rahulkudum@gmail.com",
  to: "rahulrayalhk@gmail.com",
  subject: "AOC book order",
  text: "Thank for Purchasing AOC, you will be getting the book very soon 1",
 };

 transporter.sendMail(mailOptions, (err, data) => {
  if (err) {
   res.send(err);
  } else {
   res.send("sucess");
  }
 });
});

module.exports = router;
