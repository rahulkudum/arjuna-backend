const router = require("express").Router();
let Order = require("../models/order.model");

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
 key_id: "rzp_test_WQG7sTrp3IgCeQ",
 key_secret: "968V3t6qgs7EZ72McP1wx4gQ",
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
  const date = new Date();
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
   .then((resp) => res.json(resp))
   .catch((err) => console.log(err));
 } else {
  // pass it
 }
});

router.route("/dummy").post(async (req, res) => {
 console.log(req.body);
 const name = req.body.payload.payment.entity.notes.name;
 const email = req.body.payload.payment.entity.email;
 const phno = req.body.payload.payment.entity.contact;
 const date = new Date();
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
  .then((resp) => res.json(resp))
  .catch((err) => console.log(err));
});

module.exports = router;
