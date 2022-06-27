const { Post } = require("../models");
const { Web3Storage, getFilesFromPath } = require("web3.storage");
require("dotenv").config();
var fs = require("fs");

const WEB3STORAGE_TOKEN = process.env.WEB3STORAGE_TOKEN;

/**
 * multer middleware for hadnling multipart/form-data (stores all file on server)
 * validation
 * upload file on ipfs using web3.storage
 * remove file from server
 * store post metadata in mongoDB
 */

/**
 * req
 */

const uploadPost = async (req, res) => {
  try {
    // multer is a middleware for handling multipart/form-data
    // req.file will contain the file info and location where file is stored
    // req.body will contain other input fields

    // TODO: validation

    const { filename, originalname, path } = req.file;
    const { genre, tags } = req.body;
    const userId = req.user.id;

    // upload file on ipfs using web3.storage
    const storage = new Web3Storage({ token: WEB3STORAGE_TOKEN });
    const files = [];
    console.log(WEB3STORAGE_TOKEN);
    console.log(storage);
    const pathFiles = await getFilesFromPath(path);
    files.push(...pathFiles);

    const ipfscid = await storage.put(files);
    console.log(ipfscid);
    const ipfslink = "https://" + ipfscid + ".ipfs.dweb.link/" + filename;

    // remove file stored on server
    fs.unlinkSync(path);

    // store metadata in mongoDB
    const post = new Post({
      originalname,
      filename,
      postedBy: userId,
      ipfslink,
      ipfscid,
      genre,
      tags,
    });

    await post.save();

    return res.status(200).json({
      success: true,
      data: post,
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
 * @param postId
 */

const getPost = async (req, res) => {
  try {
    const id = req.params.postId;

    let post = await Post.findOne({ _id: id }, { __v: 0 });
    if (post) {
      return res.status(200).json({
        success: true,
        data: post,
      });
    }

    return res.status(422).json({
      success: false,
      errorType: "Invalid Post Id",
      errorMessage: "Invalid Post",
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
 * @param postId
 */

const like = async (req, res) => {
  try {
    let post = await Post.findByIdAndUpdate(req.params.postId, {
      $push: { likes: req.user.id },
    });
    if (!post) {
      return res.status(422).json({
        success: false,
        errorType: "Unprocessable Entry",
        errorMessage: "Invalid Id",
      });
    }
    return res.status(200).json({
      success: true,
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
 * @param postId
 */

const unlike = async (req, res) => {
  try {
    let post = await Post.findByIdAndUpdate(req.params.postId, {
      $pull: { likes: req.user.id },
    });

    if (!post) {
      return res.status(422).json({
        success: false,
        errorType: "Unprocessable Entry",
        errorMessage: "Invalid Id",
      });
    }

    return res.status(200).json({
      success: true,
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
 * @param postId
 */

const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const comment = {
      text: req.body.text,
      postedBy: userId,
    };
    let post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $push: { comments: comment },
      },
      { new: true }
    );
    if (!post) {
      return res.status(422).json({
        success: false,
        errorType: "Unprocessable Entry",
        errorMessage: "Invalid Id",
      });
    }
    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error",
    });
  }
};

/**
 * req
 * @param postId
 * @param commentId
 */

const deleteComment = async (req, res) => {
  try {
    let post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: { comments: { _id: req.params.commentId } },
      },
      { new: true }
    );
    if (!post) {
      return res.status(422).json({
        success: false,
        errorType: "Unprocessable Entry",
        errorMessage: "Invalid Id",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      errorMessage: "Internal Server Error",
      errorType: "Internal Server Error",
    });
  }
};

module.exports = {
  uploadPost,
  getPost,
  like,
  unlike,
  addComment,
  deleteComment,
};
