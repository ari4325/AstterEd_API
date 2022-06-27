const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const CourseSchema = mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    courseLevel: {
      type: String,
      required: true,
    },
    courseDuration: {
      type: Number, // in milliseconds
      required: true,
    },
    courseOverview: {
      type: String,
      required: true,
    },
    courseInstructor: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    courseTopics: [
      {
        type: ObjectId,
        ref: "Post",
      },
    ],
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", CourseSchema);
