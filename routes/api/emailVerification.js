const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const nodemailer = require("nodemailer");

//Bring User Model
const User = require("../../dataModels/User");

// @route   POST api/verify
// @desc    Verify User's Email
// @access  public
router.post("/", async (req, res) => {
  // De-structure from req.body
  const { email, forgot } = req.body;

  try {
    let user = await User.findOne({ email });

    // If ForgotPassword is true
    if (forgot) {
      // Check if user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid Credentials" }] });
      }
    } else {
      // Check if user exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ message: "User Already Exists" }] });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Encrypt OTP
    const salt = await bcrypt.genSalt(10);
    const encryptedOTP = await bcrypt.hash(otp, salt);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.get("userEmail"),
        pass: config.get("userPassword"),
      },
    });
    const mailoptions = {
      from: config.get("userEmail"),
      to: email,
      subject: "OTP for validating your Account",
      html:
        "<h1>" +
        otp +
        "</h1>" +
        "<h3>Your ONE TIME PASSWORD expires in 3 minutes</h3>",
    };
    transporter.sendMail(mailoptions, (err, info) => {
      if (err) {
        console.log("error while sending the email", err);
      } else {
        return res.send({ email: email, otp: encryptedOTP });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
