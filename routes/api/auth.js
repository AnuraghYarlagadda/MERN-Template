const express = require("express");
const router = express.Router();
const verifyAuth = require("../../middleware/verifyAuth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

//Bring User Model
const User = require("../../dataModels/User");

// @route   GET api/auth
// @desc    Get Logged-In user's details excluding password
// @access  private
router.get("/", verifyAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth
// @desc    Authenticate user and get token (Log-In Route)
// @access  public
router.post("/", async (req, res) => {
  //De-structure from req.body
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    // Check if user exists
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ message: "Invalid Credentials" }] });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ message: "Invalid Credentials" }] });
    }
    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 7200 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
