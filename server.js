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

app.use("/user", usersRouter);
app.use("/webinar", webinarsRouter);
app.use("/pwebinar", pwebinarsRouter);

io.on("connection", (socket) => {
 console.log("connection established");
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
 console.log("listening on port " + port);
});
