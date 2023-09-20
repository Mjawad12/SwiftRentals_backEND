const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  verification: {
    type: String,
    require: true,
  },
});

const model = mongoose.model("Users", UserSchema);
model.createIndexes();
module.exports = model;
