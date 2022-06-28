const { User } = require("../models");
const { Web3Storage, getFilesFromPath } = require("web3.storage");
require("dotenv").config();
var fs = require("fs");

const WEB3STORAGE_TOKEN = process.env.WEB3STORAGE_TOKEN;

const {
  checkIfUserWithAccountAddressExists,
  checkIfUserWithEmailExists,
} = require("../utils");

const register = async (req, res) => {
  try {
    const { name, email, accountAddress, DOB } = req.body;
    let { subjectPreferences, preferredTimings } = req.body;
    subjectPreferences = subjectPreferences.split(", ");
    preferredTimings = preferredTimings.split(", ");

    let checkUserExists = await checkIfUserWithAccountAddressExists(
      accountAddress
    );
    if (checkUserExists) {
      return res.status(409).json({
        success: false,
        errorType: "Conflict",
        errorMessage: "User with similar account address exists",
      });
    }
    checkUserExists = await checkIfUserWithEmailExists(email);
    if (checkUserExists) {
      return res.status(409).json({
        success: false,
        errorType: "Conflict",
        errorMessage: "User with similar email exists",
      });
    }

    const { filename, path } = req.file;

    const storage = new Web3Storage({ token: WEB3STORAGE_TOKEN });
    const files = [];
    const pathFiles = await getFilesFromPath(path);
    files.push(...pathFiles);

    const ipfscid = await storage.put(files);
    const ipfslink = "https://" + ipfscid + ".ipfs.dweb.link/" + filename;

    // remove file stored on server
    fs.unlinkSync(path);

    let user = new User({
      name,
      email,
      accountAddress,
      profilePicture: {
        ipfslink,
        ipfscid,
      },
      DOB,
      subjectPreferences,
      preferredTimings,
    });

    user = await user.save();

    req.session.isAuthenticated = true;
    req.session.userId = user._id;
    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
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

const login = async (req, res) => {
  const { accountAddress } = req.body;

  const user = await User.findOne(
    { accountAddress: accountAddress },
    { name: 1, accountAddress: 1, followers: 1, following: 1 }
  );

  if (!user) {
    return res.status(400).json({
      success: false,
      errorType: "Bad Request",
      errorMessage: "User does not exist",
    });
  }

  req.session.isAuthenticated = true;
  req.session.userId = user._id;
  return res.status(200).json({
    success: true,
    message: "Login Successful",
    data: user,
  });
};

/**
 * req
 * @param userId
 */

const editUser = async (req, res) => {
  // validate if user id is of type MongoDB Object ID

  try {
    const userId = req.user.id;

    if (req.params.userId.toString() !== userId.toString()) {
      return res.status(422).json({
        success: false,
        errorType: "Invalid User Id",
        errorMessage: "Query userId & Logged userId doesn't match",
      });
    }

    let user = await User.findOne({ _id: userId }, { __v: 0 });
    if (!user) {
      return res.status(422).json({
        success: false,
        errorType: "Invalid User Id",
        errorMessage: "Invalid User, Couldn't Edit",
      });
    }

    const { name, email, DOB } = req.body;
    let { subjectPreferences, preferredTimings } = req.body;

    if (
      !name &&
      !email &&
      !DOB &&
      !subjectPreferences &&
      !preferredTimings &&
      !req.file
    ) {
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
    if (DOB) {
      user.DOB = DOB;
    }
    if (subjectPreferences) {
      subjectPreferences = subjectPreferences.split(", ");
      user.subjectPreferences = subjectPreferences;
    }
    if (preferredTimings) {
      preferredTimings = preferredTimings.split(", ");
      user.preferredTimings = preferredTimings;
    }

    if (req.file) {
      const { filename, path } = req.file;

      const storage = new Web3Storage({ token: WEB3STORAGE_TOKEN });
      const files = [];
      const pathFiles = await getFilesFromPath(path);
      files.push(...pathFiles);

      const ipfscid = await storage.put(files);
      const ipfslink = "https://" + ipfscid + ".ipfs.dweb.link/" + filename;

      // remove file stored on server
      fs.unlinkSync(path);

      user.profilePicture.ipfslink = ipfslink;
      user.profilePicture.ipfscid = ipfscid;
    }

    user = await user.save();
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
      errorType: "Invalid User Id",
      errorMessage: "Invalid User",
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
      { __v: 0, timestamps: 0, email: 0 }
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

/**
 * req
 * @param followId
 */

const followUser = async (req, res) => {
  try {
    const { followId } = req.params;
    const userId = req.user.id;
    await User.findByIdAndUpdate(followId, { $push: { followers: userId } });
    await User.findByIdAndUpdate(userId, { $push: { following: followId } });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(422).json({
      success: false,
      errorType: "Invalid User Id",
      errorMessage: "Unprocessable Entry",
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
    const userId = req.user.id;
    await User.findByIdAndUpdate(unfollowId, { $pull: { following: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { followers: unfollowId } });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(422).json({
      success: false,
      errorType: "Invalid User Id",
      errorMessage: "Unprocessable Entry",
    });
  }
};

module.exports = {
  login,
  register,
  editUser,
  getUser,
  searchUser,
  followUser,
  unfollowUser,
};
