const express = require("express");
const user = require("./Routes/Users");
const db = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
var cors = require("cors");
const reservation = require("./Routes/reservation");
const Port = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("launched /");
});
app.use("/api/", user);
app.use("/api/reserv", reservation);

const connectToDb = () => {
  db.connect(process.env.Connection_string)
    .then(() => {
      console.log("Connected to Db");
      app.listen(process.env.PORT || Port, () => {
        console.log("app launched on port 5500");
      });
    })
    .catch((error) => {
      console.log("Can not Connecy to Db" + error);
    });
};

connectToDb();
