const express = require("express");
const user = require("./Routes/Users");
const db = require("./ConnectToDb");
var cors = require("cors");
const reservation = require("./Routes/reservation");

const app = express();
app.use(cors());
db();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("launched /");
});

app.use("/api/", user);
app.use("/api/reserv", reservation);

app.listen(5500, () => {
  console.log("app launched on port 5500");
});
