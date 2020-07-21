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
      { expiresIn: config.get("expiresIn") },
      (err, token) => {
        if (err) throw err;
        res.json({ token: token, name: user.name });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/auth/changePassword
// @desc    Change User Password
// @access  private
router.put("/changePassword", verifyAuth, async (req, res) => {
  //De-structure from req.body
  const { current_password, password } = req.body;

  try {
    let user = await User.findById(req.user.id);
    // Check if user exists
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ message: "Invalid Credentials" }] });
    }

    // Check password
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ message: "Password Incorrect" }] });
    }
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(200).json({ message: "Password Updated!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/auth/editProfile
// @desc    Edit user Profile
// @access  private
router.put("/editProfile", verifyAuth, async (req, res) => {
  //De-structure from req.body
  const { password, name } = req.body;

  try {
    let user = await User.findById(req.user.id);
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
        .json({ errors: [{ message: "Password Incorrect" }] });
    }

    user.name = name;
    await user.save();
    res.status(200).json({ message: "Profile Updated!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/auth/resetPassword
// @desc    Reset User Password when forgot
// @access  public
router.put("/resetPassword", async (req, res) => {
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

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(200).json({ message: "Password reset successfull!" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
