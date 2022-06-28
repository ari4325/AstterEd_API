require("dotenv").config();
const { Router } = require("express");
const router = Router();
const { upload } = require("../middlewares/multer");

const { UserController } = require("../controllers");
const { requireSign, requireLogin } = require("../middlewares/auth");

router.post("/login", requireSign, UserController.login);
router.post(
  "/register",
  upload.single("profilePicture"),
  requireSign,
  UserController.register
);

router.patch(
  "/:userId",
  requireLogin,
  upload.single("profilePicture"),
  UserController.editUser
);

router.get("/:userId", requireLogin, UserController.getUser);
router.get("/", requireLogin, UserController.searchUser);

module.exports = router;
