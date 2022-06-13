const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // required: false,
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
  timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);
