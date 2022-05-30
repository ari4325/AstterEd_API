const User = require("../models/User");

const {
  checkIfUserWithAccountAddressExists,
  checkIfUserWithEmailExists,
} = require("../utils");

const register = async (req, res) => {
  try {
    const { name, email, accountAddress } = req.body;
    if (checkIfUserWithAccountAddressExists(email)) {
      return res.json({
        success: false,
        errType: "Validation Error",
        errMessage: "User with similar account address exists",
      });
    }
    if (checkIfUserWithEmailExists(email)) {
      return res.json({
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
    return res.json({
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

const login = async (req, res) => {
  try {
    const { accountAddress } = req.headers;

    const user = User.findOne(
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

const editUser = async (req, res) => {
  // validate if user id is of type MongoDB Object ID

  try {
    const id = req.params.id;

    let user = User.findOne({ _id: id }, { __v: 0 });
    if (!user) {
      return res.json({
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

const getUser = async (req, res) => {
  // validate if user id is of type MongoDB Object ID

  try {
    const id = req.params.id;

    let user = User.findOne({ _id: id }, { __v: 0 });
    if (user) {
      return res.json({
        success: true,
        data: user,
      });
    }

    return res.json({
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

module.exports = {
  editUser,
  getUser,
  login,
  register,
};
