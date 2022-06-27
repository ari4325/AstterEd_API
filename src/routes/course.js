require("dotenv").config();
const { Router } = require("express");
const router = Router();

const { CourseController } = require("../controllers");
const { requireLogin } = require("../middlewares/auth");

router.post("/", requireLogin, CourseController.createCourse);

router.get("/:courseId", requireLogin, CourseController.getCourse);

router.patch(
  "/:courseId/addcomment",
  requireLogin,
  CourseController.addComment
);

router.patch(
  "/:courseId/deletecomment/:commentId",
  requireLogin,
  CourseController.deleteComment
);

router.patch("/:courseId/like", requireLogin, CourseController.like);

router.patch("/:courseId/unlike", requireLogin, CourseController.unlike);

module.exports = router;
