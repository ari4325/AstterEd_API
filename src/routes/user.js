require("dotenv").config();
const { Router } = require("express");
const router = Router();

const { UserController, LoginController } = require("../controllers");
const { isValidSign, isAuthenticated } = require("../middlewares/auth");

router.post("/login", isValidSign, LoginController.login);
router.post("/register", isValidSign, LoginController.register);

router.patch("/:id", isAuthenticated, UserController.editUser);
router.get("/:id", isAuthenticated, UserController.getUser);
router.get("/", isAuthenticated, UserController.searchUser);

module.exports = router;
