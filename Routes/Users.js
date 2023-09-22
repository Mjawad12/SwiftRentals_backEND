const express = require("express");
const router = express.Router();
const User = require("../Schema/UserSchema");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fetchuser = require("../MiddleWare/fetchuser");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const { body, validationResult } = require("express-validator");
const mailer = require("../MiddleWare/sendmail");
const { SendMail, otp } = mailer;
const JWT_String = process.env.Secret_string;

// create a user and get an authentication code  : : : sign up
router.post(
  "/createuser",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("name", "Enter a valid Name").isLength({ min: 4 }).isString(),
    body("password", "Enter a valid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(errors.array());
      }

      let user = await User.findOne({ email: req.body.email });
      let username = await User.findOne({ name: req.body.name });
      let err = ["An account already exsits with this Email"];
      let err1 = ["An account already exsits with this Name"];
      if (user) {
        return res.status(400).json(err);
      } else if (username) {
        return res.status(400).json(err1);
      }

      const gensalts = await bcrypt.genSalt(10);
      const securedPassword = await bcrypt.hash(req.body.password, gensalts);

      user = await User.create({
        name: req.body.name,
        password: securedPassword,
        email: req.body.email,
        verification: req.body.verification,
      });

      if (user.verification === "NO") {
        console.log("entered");
        const otp_no = otp();
        // SendMail(user.email, otp_no)
        //   .then(() => {
        //     console.log("success");
        //   })
        //   .catch((error) => {
        //     console.log(error.message);
        //   });

        return res.status(200).send({ otp: otp_no });
      } else {
        const data = {
          id: user.id,
        };

        var token = jwt.sign(data, JWT_String);
        return res.status(200).send({ authtoken: token });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

// verify user and get an authentication token   : : : sign in

router.post(
  "/signin",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(errors.array());
      }
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).send(["Enter a valid Email"]);
      }
      const pas = await bcrypt.compare(req.body.password, user.password);
      if (!pas) {
        return res.status(404).send(["Enter a valid password"]);
      }

      if (user.verification === "NO") {
        console.log("entered");
        const otp_no = otp();
        // SendMail(user.email, otp_no)
        //   .then(() => {
        //     console.log("success");
        //   })
        //   .catch((err) => {
        //     return res.status(400).send({ error: err.message });
        //   });

        return res.status(200).send({ otp: otp_no });
      } else {
        const data = {
          id: user.id,
        };
        const token = jwt.sign(data, JWT_String);
        return res.status(200).send({ authtoken: token });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

//     get user data
router.post("/test", fetchuser, async (req, res) => {
  try {
    const user_id = req.id;
    const user = await User.findById(user_id).select("-password");

    if (user === null) {
      return res.send("Error");
    }
    return res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//  verfify otp

router.post("/verifyOTP", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    await User.updateOne(user, { $set: { verification: "YES" } })
      .then(() => {})
      .catch((error) => {
        res.send({ error: error.message });
      });
    const data = {
      id: user.id,
    };
    const authtoken = jwt.sign(data, JWT_String);
    res.status(200).send({ authtoken: authtoken });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
