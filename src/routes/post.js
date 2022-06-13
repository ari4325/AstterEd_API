require("dotenv").config();
const { Router } = require("express");
const router = Router();
const { upload } = require("../middlewares/multer");

const {
  PostController,
  CommentsController,
  LikesController,
} = require("../controllers");
const { isAuthenticated } = require("../middlewares/auth");

router.post(
  "/",
  // change filename accordingly
  upload.single("uploadFileFieldName"),
  isAuthenticated,
  PostController.uploadPost
);

router.get("/:id", isAuthenticated, PostController.getPost);
// router.delete("/:id", isAuthenticated, PostController.deletePost);

router.patch(
  "/:postId/addcomment",
  isAuthenticated,
  CommentsController.addComment
);

router.patch(
  "/:postId/deletecomment/:commentId",
  isAuthenticated,
  CommentsController.deleteComment
);

router.patch("/:postId/like", isAuthenticated, LikesController.like);
router.patch("/:postId/unlike", isAuthenticated, LikesController.unlike);

module.exports = router;
