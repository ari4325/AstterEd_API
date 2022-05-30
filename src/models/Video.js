const mongoose = require("mongoose");

const VideoSchema = mongoose.Schema({
  originalname: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  // timestamp: {
  //   type: String,
  //   required: true,
  // },
  duration: {
    type: Number, // store duration in milliseconds
    // required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  link: {
    type: String,
    required: true,
  },
  cid: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Video", VideoSchema);
