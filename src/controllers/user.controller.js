const User = require("../models/User");

/**
 * req
 * @param userId
 */

const editUser = async (req, res) => {
  // validate if user id is of type MongoDB Object ID

  try {
    const { userId } = req.params.userId;

    let user = User.findOne({ _id: userId }, { __v: 0 });
    if (!user) {
      return res.status(422).json({
        success: false,
        errType: "Invalid User Id",
        errmessage: "Invalid User, Couldn't Edit",
      });
    }

    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        success: false,
        errorType: "Bad Request",
        errorMessage: "data not updated due to no changes",
      });
    }

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    // don't allow user to change accountAddress
    // if (accountAddress) {
    //   user.accountAddress = accountAddress;
    // }

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Update Successful",
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error",
    });
  }
};

/**
 * req
 * @param userId
 */

const getUser = async (req, res) => {
  // validate if user id is of type MongoDB Object ID

  try {
    const { userId } = req.params;

    let user = await User.findOne({ _id: userId }, { __v: 0 });
    if (user) {
      return res.status(200).json({
        success: true,
        data: user,
      });
    }

    return res.status(422).json({
      success: false,
      errType: "Invalid User Id",
      errmessage: "Invalid User",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error",
    });
  }
};

const searchUser = async (req, res) => {
  try {
    if (req.query.search.length < 2) {
      return res.status(400).json({
        success: false,
        errorType: "Bad Request",
        errorMessage: "Search query length is less than 2",
      });
    }
    let query = new RegExp("^" + req.query.search);
    let users = await User.find(
      { name: { $regex: query } },
      { __v: 0, timestamps: 0, password: 0, email: 0 }
    );
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error",
    });
  }
};

module.exports = {
  editUser,
  getUser,
  searchUser,
};
