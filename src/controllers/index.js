const LoginController = require("./login.controller");
const CommentsController = require("./comments.controller");
const FollowController = require("./follow.controller");
const PostController = require("./post.controller");
const UserController = require("./user.controller");
const LikesController = require("./likes.controller");

module.exports = {
  UserController,
  PostController,
  FollowController,
  CommentsController,
  LoginController,
  LikesController,
};
