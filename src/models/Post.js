const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const PostSchema = mongoose.Schema(
  {
    originalname: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // store duration in milliseconds
      // required: true,
    },
    postedBy: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    ipfslink: {
      type: String,
      required: true,
    },
    ipfscid: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        text: String,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
    shares: {
      type: Number,
      default: 0,
    },
    genre: [
      {
        type: String,
        required: true,
      },
    ],
    tags: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
