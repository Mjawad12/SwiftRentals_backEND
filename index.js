const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
var cors = require("cors");
const reservation = require("./Routes/reservation");
const user = require("./Routes/Users");

const ConnectTodb = async () => {
  try {
    mongoose.connect(process.env.Connection_string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    });
    console.log("Connected");
  } catch (error) {
    console.log("Can not connect to db" + error.message);
    process.exit(1);
  }
};
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("launched /");
});

app.use("/api/", user);
app.use("/api/reserv", reservation);

ConnectTodb()
  .then(() => {
    console.log("Connected to Db");
    app.listen(process.env.PORT || 5000, () => {
      console.log("app launched on port 3000");
    });
  })
  .catch((error) => {
    console.log("Can not Connecy to Db" + error.message);
  });
