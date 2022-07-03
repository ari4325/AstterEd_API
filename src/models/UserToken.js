const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const UserTokenSchema = mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      index: true,
      ref: "User",
    },
    registrationToken: {
      type: String,
      required: true,
    },
    subscribedTopics: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserToken", UserTokenSchema);
