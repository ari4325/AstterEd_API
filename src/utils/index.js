const User = require("../models/User");

const checkIfUserWithAccountAddressExists = async (accountAddress) => {
  try {
    let user = await User.findOne({ accountAddress });
    if (user) {
      return true;
      // return { success: true, message: "User Already Exists", exists: true };
    } else {
      return false;
      // return { success: true, message: "User does not exists", exists: false };
    }
  } catch (err) {
    console.log(err);
    return false;
    // return {
    //   success: false,
    //   errType: "Internal Server Error",
    //   errMessage: err,
    // };
  }
};

const checkIfUserWithEmailExists = async (email) => {
  try {
    let user = await User.findOne({ email });
    if (user) {
      // return { success: true, exists: true };
      return true;
    } else {
      return false;
      // return { success: true, exists: false };
    }
  } catch (err) {
    console.log(err);
    // return { success: false, errMessage: err };
    return false;
  }
};

module.exports = {
  checkIfUserWithAccountAddressExists,
  checkIfUserWithEmailExists,
};
