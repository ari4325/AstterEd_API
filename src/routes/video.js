require("dotenv").config();
const { Router } = require("express");
const router = Router();
const { upload } = require("../middlewares/multer");

const videoController = require("../controllers/video.controller");
const { isAuthenticated } = require("../middlewares/auth");

router.post(
  "/",
  // change filename accordingly
  upload.single("uploadFileFieldName"),
  isAuthenticated,
  videoController.uploadVideo
);

router.get("/:id", isAuthenticated, videoController.getVideo);

module.exports = router;
