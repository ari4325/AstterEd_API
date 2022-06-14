const Post = require("../models");
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
    const { userId, genre, tags } = req.body;

    // upload file on ipfs using web3.storage
    const storage = new Web3Storage({ WEB3STORAGE_TOKEN });
    const files = [];

    const pathFiles = await getFilesFromPath(path);
    files.push(...pathFiles);

    const ipfscid = await storage.put(files);
    const ipfslink = "https://" + ipfscid + ".ipfs.dweb.link/" + filename;

    // remove file stored on server
    fs.unlinkSync(path);

    // store metadata in mongoDB
    const post = new Post({
      originalname,
      filename,
      userId,
      ipfslink,
      ipfscid,
      genre,
      tags,
    });

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Upload Successfull",
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
      errType: "Invalid Post Id",
      errmessage: "Invalid Post",
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

module.exports = { uploadPost, getPost };
