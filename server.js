const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
 cors: {
  origin: "*",
  credentials: true,
 },
});
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

const uri = "mongodb+srv://arjuna:arjuna@cluster0.ypjlp.mongodb.net/arjuna?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
 console.log("mongodb sucess");
});

const usersRouter = require("./routes/users");
const webinarsRouter = require("./routes/webinars")(io);
const pwebinarsRouter = require("./routes/pwebinars");
const paymentsRouter = require("./routes/payment");

app.use("/user", usersRouter);
app.use("/webinar", webinarsRouter);
app.use("/pwebinar", pwebinarsRouter);
app.use("/payment", paymentsRouter);

io.on("connection", (socket) => {
 console.log("connection established");
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
 console.log("listening on port " + port);
});

// TWILIO 17_nWpBSJ8tw7UMMvYVeNW_PZkTeoq06Iw5k-zTJ

// const accountSid = "ACbff238b651aa9e4e3897654e746bedb3";
// const authToken = "a462c3b769b404a52fc37bf170abe364";
// const client = require("twilio")(accountSid, authToken);

// client.messages
//  .create({
//   body: "Your appointment is coming up on 22nd at zoom",
//   from: "whatsapp:+14155238886",
//   to: "whatsapp:+919133431764",
//  })
//  .then((message) => console.log(message.sid))
//  .done();
