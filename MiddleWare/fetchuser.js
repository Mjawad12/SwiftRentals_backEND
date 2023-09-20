const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const fetchuser = async (req, res, next) => {
  try {
    const token = await jwt.verify(
      req.headers.authtoken,
      process.env.Secret_string
    );

    if (!token) {
      return res.status(400).send("AuthToken did not get verified");
    }
    req.id = token.id;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
};

module.exports = fetchuser;
