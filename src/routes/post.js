require("dotenv").config();
const { Router } = require("express");
const router = Router();
const { upload } = require("../middlewares/multer");

const { PostController } = require("../controllers");
const { requireLogin } = require("../middlewares/auth");

router.post(
  "/",
  requireLogin,
  // change filename accordingly
  upload.single("filename"),
  PostController.uploadPost
);

router.get("/:postId", requireLogin, PostController.getPost);
// router.delete("/:id", requireLogin, PostController.deletePost);

router.patch("/:postId/addcomment", requireLogin, PostController.addComment);

router.patch(
  "/:postId/deletecomment/:commentId",
  requireLogin,
  PostController.deleteComment
);

router.patch("/:postId/like", requireLogin, PostController.like);
router.patch("/:postId/unlike", requireLogin, PostController.unlike);

module.exports = router;
