require("dotenv").config();
const { Router } = require("express");
const router = Router();

const UserController = require("../controllers/user.controller");
const { isValidSign, isAuthenticated } = require("../middlewares/auth");

router.post("/login", isValidSign, UserController.login);
router.post("/register", isValidSign, UserController.register);
router.patch("/:id", isAuthenticated, UserController.editUser);
router.get("/:id", isAuthenticated, UserController.getUser);

module.exports = router;
