const { Post } = require("../models");
/**
 * req
 * @param postId
 */

const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const comment = {
      text: req.body.text,
      postedBy: userId,
    };
    await Post.findByIdAndUpdate(req.params.postId, {
      $push: { comments: comment },
    });
    return res.status(200).json({
      success: true,
      // data
    });
  } catch (err) {
    return res.status(422).json({
      success: false,
      errType: "Unprocessable Entry",
      errmessage: "Invalid Id",
    });
  }
};

/**
 * req
 * @param postId
 * @param commentId
 */

const deleteComment = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, {
      $pull: { comments: { _id: req.params.commentId } },
    });
    return res.status(200).json({
      success: true,
      // data:
    });
  } catch (err) {
    return res.status(422).json({
      success: false,
      errType: "Unprocessable Entry",
      errmessage: "Invalid Id",
    });
  }
};

module.exports = { addComment, deleteComment };
