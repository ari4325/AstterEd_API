const User = require("../models/User");

const {
  checkIfUserWithAccountAddressExists,
  checkIfUserWithEmailExists,
} = require("../utils");

/**
 * req
 */

const register = async (req, res) => {
  try {
    const { name, email, accountAddress } = req.body;
    if (checkIfUserWithAccountAddressExists(email)) {
      return res.status(400).json({
        success: false,
        errType: "Validation Error",
        errMessage: "User with similar account address exists",
      });
    }
    if (checkIfUserWithEmailExists(email)) {
      return res.status(400).json({
        success: false,
        errType: "Validation Error",
        errMessage: "User with similar email address exists",
      });
    }

    let user = new User({
      name,
      email,
      accountAddress,
    });

    await user.save();

    req.session.isAuthenticated = true;
    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
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
 */

const login = async (req, res) => {
  try {
    const { accountAddress } = req.headers;

    const user = await User.findOne(
      { accountAddress: accountAddress },
      { __v: 0, _id: 0 }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        errorType: "Bad Request",
        errorMessage: "User does not exist", // user dne
      });
    }

    res.session.isAuthenticated = true;

    return res.status(200).json({
      success: true,
      message: "Login Successful",
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
  login,
  register,
};
