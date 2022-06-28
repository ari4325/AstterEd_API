const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    accountAddress: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    DOB: {
      type: Date,
    },
    subjectPreferences: [
      {
        type: String,
      },
    ],
    preferredTimings: [
      {
        type: String,
      },
    ],
    profilePicture: {
      ipfslink: {
        type: String,
      },
      ipfscid: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
