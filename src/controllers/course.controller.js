const { Course } = require("../models");

const createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseLevel,
      courseDuration,
      courseOverview,
      courseTopics,
    } = req.body;

    const courseInstructor = req.user.id;

    const course = new Course({
      courseName,
      courseLevel,
      courseDuration,
      courseOverview,
      courseTopics,
      courseInstructor,
    });

    await course.save();

    return res.status(201).json({
      success: true,
      data: course,
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

const getCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    let course = await Course.findById({ _id: courseId }, { __v: 0 });
    if (course) {
      return res.status(200).json({
        success: true,
        data: course,
      });
    }
    return res.status(422).json({
      success: false,
      errorType: "Invalid Course Id",
      errorMessage: "Invalid Course",
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

const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const comment = {
      text: req.body.text,
      postedBy: userId,
    };
    let course = await Course.findByIdAndUpdate(
      req.params.courseId,
      {
        $push: { comments: comment },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    return res.status(422).json({
      success: false,
      errorType: "Unprocessable Entry",
      errorMessage: "Invalid Id",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    let course = await Course.findByIdAndUpdate(
      req.params.courseId,
      {
        $pull: { comments: { _id: req.params.commentId } },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    return res.status(422).json({
      success: false,
      errorType: "Unprocessable Entry",
      errorMessage: "Invalid Id",
    });
  }
};

const like = async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.courseId, {
      $push: { likes: req.user.id },
    });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(422).json({
      success: false,
      errorType: "Unprocessable Entry",
      errorMessage: "Invalid Id",
    });
  }
};

const unlike = async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.courseId, {
      $pull: { likes: req.user.id },
    });
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(422).json({
      success: false,
      errorType: "Unprocessable Entry",
      errorMessage: "Invalid Id",
    });
  }
};

module.exports = {
  createCourse,
  getCourse,
  addComment,
  deleteComment,
  like,
  unlike,
};
