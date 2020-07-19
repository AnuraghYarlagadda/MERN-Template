const express = require("express");
const router = express.Router();
const config = require("config");
const verifyAuth = require("../../middleware/verifyAuth");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
  cloud_name: config.get("cloud_name"),
  api_key: config.get("api_key"),
  api_secret: config.get("api_secret"),
});

var storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "assets",
  allowedFormats: ["jpg", "png", "pdf", "csv", "xls", "xlsx", "mp4", "pptx"],
  filename: function (req, file, cb) {
    cb(undefined, file.fieldname + "-" + Date.now());
  },
});

//importing multer
const multer = require("multer");
var uploader = multer({ storage: storage });

// @route   POST api/file
// @desc    Upload file
// @access  Private
router.post("/", [verifyAuth, uploader.single("file")], async (req, res) => {
  try {
    console.log(req.file);
    res.json(req.file);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
