const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use(cors());

const uri = "mongodb+srv://arjuna:arjuna@cluster0.ypjlp.mongodb.net/arjuna?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
 console.log("mongodb sucess");
});

const usersRouter = require("./routes/users");
const webinarsRouter = require("./routes/webinars");
const pwebinarsRouter = require("./routes/pwebinars");

app.use("/user", usersRouter);
app.use("/webinar", webinarsRouter);
app.use("/pwebinar", pwebinarsRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
 console.log(`server is running on port `);
});

// const app = require("express")();
// const http = require("http").createServer(app);
// const io = require("socket.io")(http);

// io.on("connection", (socket) => {
//  socket.on("message", (req) => {
//   console.log(req);
//   io.emit("message", "response1");
//   io.emit("message", "response2");
//  });
// });

// http.listen(4000, function () {
//  console.log("listening on port 4000");
// });
