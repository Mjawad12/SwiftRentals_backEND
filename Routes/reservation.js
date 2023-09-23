const express = require("express");
const router = express.Router();
const Reservation = require("../Schema/ReservationSchema");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../MiddleWare/fetchuser");

router.post(
  "/createReservation",
  [
    body("firstname", "Enter valid Name").isString().isLength({ min: 4 }),
    body("lastname", "Enter valid Name").isString().isLength({ min: 4 }),
    body("phonenumber", "Enter valid Phone Number")
      .isLength({ min: 11 })
      .isNumeric(),
  ],
  fetchuser,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).send({ error: error.array() });
    }
    try {
      const carname = await Reservation.findOne({
        carname: req.body.carname,
        user: req.id,
      });
      if (carname) {
        return res
          .status(400)
          .send({ error: "Already made reservation of this car" });
      }

      const reserv = await Reservation.create({
        user: req.id,
        carname: req.body.carname,
        Pickupdate: req.body.pickupdate,
        Dropofdate: req.body.dropofdate,
        PickupLocation: req.body.pickupLocation,
        DropofLocation: req.body.dropofLocation,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        phonenumber: req.body.phonenumber,
      });

      return res
        .status(200)
        .send({ msg: "Your reservation has been made check your email" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

router.get("/getReservations", fetchuser, async (req, res) => {
  try {
    const reservation = await Reservation.find({ user: req.id });
    res.status(200).send({ Reservation: reservation });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/cancelReservation", fetchuser, async (req, res) => {
  try {
    const user = await Reservation.find({ user: req.id });
    for (let i in user) {
      if (user[i].id == req.body.Reservation_id) {
        var Deletedreservation = await Reservation.findByIdAndDelete(
          req.body.Reservation_id
        )
          .then(() => {})
          .catch((err) => {
            res.send({ err: err.message });
          });
      }
    }
    res.status(200).send({ Reservation: Deletedreservation });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
