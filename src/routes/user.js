require("dotenv").config();
const { Router } = require("express");
const router = Router();

const { UserController } = require("../controllers");
const { requireSign, requireLogin } = require("../middlewares/auth");

router.post("/login", requireSign, UserController.login);
router.post("/register", requireSign, UserController.register);

router.patch("/:userId", requireLogin, UserController.editUser);
router.get("/:userId", requireLogin, UserController.getUser);
router.get("/", requireLogin, UserController.searchUser);

module.exports = router;
