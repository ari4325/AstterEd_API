const { Post } = require("../models");

/**
 * req
 * @param postId
 */

const like = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, {
      $push: { likes: req.user._id },
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
 */

const unlike = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, {
      $pull: { likes: req.user._id },
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

module.exports = { like, unlike };
