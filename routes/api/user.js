const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const verifyAuth = require("../../middleware/verifyAuth");

//Bring User Model
const User = require("../../dataModels/User");
const { route } = require("./auth");

// @route   POST api/user
// @desc    Register User
// @access  public
router.post("/", async (req, res) => {
  // De-structure from req.body
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    // Check if user exists
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ message: "User Already Exists" }] });
    }

    //Create a User Object
    user = new User({
      name,
      email,
      password,
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: config.get("expiresIn") },
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

// @route   DEL api/user
// @desc    Remove User and all his entries (as of now deleting account)
// @access  Private
router.delete("/", verifyAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Deleted User!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
