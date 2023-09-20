const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  carname: {
    type: String,
    require: true,
  },
  Pickupdate: {
    type: Date,
    requiire: true,
  },
  Dropofdate: {
    type: Date,
    requiire: true,
  },
  PickupLocation: {
    type: String,
  },
  DropofLocation: {
    type: String,
  },
  firstname: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
});

const Reservation = mongoose.model("Reservation", ReservationSchema);

module.exports = Reservation;
