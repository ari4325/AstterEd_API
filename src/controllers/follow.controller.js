const User = require("../models/User");
/**
 * req
 * @param followId
 */

const followUser = async (req, res) => {
  try {
    const { followId } = req.params;
    const userId = req.user._id;
    await User.findByIdAndUpdate(followId, { $push: { followers: userId } });
    await User.findByIdAndUpdate(userId, { $push: { following: followId } });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(422).json({
      success: false,
      errType: "Invalid User Id",
      errmessage: "Unprocessable Entry",
    });
  }
};

/**
 * req
 * @param unfollowId
 */

const unfollowUser = async (req, res) => {
  try {
    const { unfollowId } = req.params;
    const userId = req.user._id;
    await User.findByIdAndUpdate(unfollowId, { $pull: { following: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { followers: unfollowId } });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(422).json({
      success: false,
      errType: "Invalid User Id",
      errmessage: "Unprocessable Entry",
    });
  }
};

module.exports = { followUser, unfollowUser };
