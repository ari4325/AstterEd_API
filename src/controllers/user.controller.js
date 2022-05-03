
const User = require('../models/User');

const checkIfUserWithAccountAddressExists = async (accountAddress) => {
  try {
    let user = await User.findOne({ accountAddress });
    if (user) {
      return { success: true, message: "User Already Exists", exists: true };
    }
    else return { success: true, message: "User does not exists", exists: false };
  }
  catch (err) {
    console.log(err);
    return { success: false, errType: "Internal Server Error", errMessage: err };
  }
}

const checkIfUserWithEmailExists = async (email) => {
  try {
    let user = await User.findOne({ email });
    if (user) {
      return { success: true, exists: true };
    }
    else return { success: true, exists: false };
  }
  catch (err) {
    console.log(err);
    return { success: false, errMessage: err };
  }
}

const createUser = async (req, res) => {
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
      name, email, accountAddress
    });

    // something about password check

    await user.save();

    return res.json({
      success: true,
      message: "User Created Successfully"
    })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error"
    })
  }
}

const editUser = async (req, res) => {
  // authentication middleware
  // validate if user id is of type MongoDB Object ID

  try {
    const id = req.params.id;

    let user = User.findOne({ _id: id }, { __v: 0 });
    if (!user) {
      return res.json({
        success: false,
        errType: "Invalid User Id",
        errmessage: "Invalid User, Couldn't Edit"
      })
    }

    const { name, email, accountAddress } = req.body;

    if (!name && !email && !accountAddress) {
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
    if (accountAddress) {
      user.accountAddress = accountAddress;
    }

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Update Successful",
      data: user,
    });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error"
    })
  }
}

const getUser = async (req, res) => {
  // validate if user id is of type MongoDB Object ID

  try {
    const id = req.params.id;

    let user = User.findOne({ _id: id }, { __v: 0 });
    if (user) {
      return res.json({
        success: true,
        data: user
      })
    }

    return res.json({
      success: false,
      errType: "Invalid User Id",
      errmessage: "Invalid User"
    })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error"
    })
  }
}


module.exports = { checkIfUserWithAccountAddressExists, checkIfUserWithEmailExists, createUser, editUser, getUser };