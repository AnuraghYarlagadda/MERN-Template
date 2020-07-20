const express = require("express");
const router = express.Router();
const config = require("config");
const uuid = require("uuid").v4;
const verifyAuth = require("../../middleware/verifyAuth");

var admin = require("firebase-admin");

var serviceAccount = config.get("firebase");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://project-c1596.appspot.com",
});
var bucket = admin.storage().bucket();
//importing multer
const multer = require("multer");
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, //10 MB
  },
});

// @route   POST api/file
// @desc    Upload file
// @access  Private
router.post("/", [verifyAuth, uploader.single("file")], async (req, res) => {
  if (!req.file) {
    res.status(400).json({ msg: "No file submitted." });
    return;
  }

  try {
    const id = uuid();
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      gzip: true,
      resumable: false,
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: id,
        },
      },
    });

    blobStream.on("error", (err) => next(err));

    blobStream.on("finish", () => {
      publicUrl =
        "https://firebasestorage.googleapis.com/v0/b/" +
        bucket.name +
        "/o/" +
        encodeURI(blob.name) +
        "?alt=media&token=" +
        id;

      res.status(200).json({
        downloadUrl: publicUrl,
      });

      // Saving the URL in DB
      // User.findById(req.user.id).then((user) => {
      //   user.photoURL = publicUrl;
      //   user.save();
      // });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ msg: "Server Error" });
  }
});
module.exports = router;
