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
    to: order.email,
    subject: "ARJUNA Book Dispatch Confirmation",
    text: `Hello ${order.name}!\n\nYour order id ${order.orderid} has been dispatched. You will receive the package within 3-5 business days.\nYour order:\n\n${order.books}\nPlease do connect with us on YouTube. We conduct monthly free webinars to help students and parents face various challenges.\n\nRespectfully,\nARJUNA Group Trust`,
    auth: {
     user: "rahulkudum@gmail.com",
     refreshToken: "1//04VuBYRmdXT1UCgYIARAAGAQSNwF-L9IrgzO6XvS9xBRqcioijQXjKlW_X3su7HrVyyteGruXj9dxGOfxKcFAcX6QceW3lnqHF1Q",
     accessToken:
      "ya29.a0ARrdaM-rc2swL1xsfJIWATGaIz8nNTdHWFjNEuIgYeioONN_YrTAg3Z-gkcjThyn3kUibN29MuWTU6RGZJHglAkOusl9Fl2I1cZIdoJ-fQbx2LoaXi4zcMz5XfjWgPLKXoJ3TGowza7dprSuwK16thcfChM7",
     expires: new Date().getTime(),
    },
   };

   transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
     console.log(err);
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
 const amount = req.body.price;
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
  const orderid = req.body.payload.payment.entity.id;
  const name = req.body.payload.payment.entity.notes.name;
  const email = req.body.payload.payment.entity.email;
  const phno = req.body.payload.payment.entity.contact;
  const date = new Date().toISOString().slice(0, 10);
  const books = req.body.payload.payment.entity.notes.books;
  const amount = req.body.payload.payment.entity.amount;
  const address = req.body.payload.payment.entity.notes.address;

  const newOrder = new Order({
   orderid,
   name,
   phno,
   email,
   date,
   books,
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
    refreshToken: "1//04X4fvo1qgr_2CgYIARAAGAQSNwF-L9IrRCnhcnl3saNzQAw-skzmQ2bfsGWhsHvUlu_yL1j5qqhld0hJko3PPCJ5mQ2d--8YvdU",
    accessToken:
     "ya29.a0ARrdaM-azZq380rDlbj43piJ0Q2dF-Vc-wcbXTOL4pBYaT6MUBHtsEhaoAFlRfMh58gJHadnZrCkOkdlxCMIcABYfrK1Is5eFdWgxPzhBtmBSRJo8vcxu9iB83mc0cHMq8TCzs5jid2rvvZMs29GaGjzdVNd",
    expires: 3600,
   },
  });

  let mailOptions = {
   from: "rahulkudum@gmail.com",
   to: email,
   subject: "ARJUNA Book Purchase Confirmation",
   text: `Hello ${name}!\n\nThank you for placing an order for:\n\n${books}\nYour order id is ${orderid}. In case of any query, please feel free to contact us on this email. Do mention the order id, so that we can better track your request. Your order will be dispatched in 3-5 business days. We will send you another confirmation email once the order is processed.\n\nRespectfully,\nARJUNA Group Trust`,
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
