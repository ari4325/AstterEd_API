const Video = require("../models");
const { Web3Storage, getFilesFromPath } = require("web3.storage");
require("dotenv").config();
var fs = require("fs");

const WEB3STORAGE_TOKEN = process.env.WEB3STORAGE_TOKEN;

/**
 * multer middleware for hadnling multipart/form-data (stores all file on server)
 * validation
 * upload file on ipfs using web3.storage
 * remove file from server
 * store video metadata in mongoDB
 */

const uploadVideo = async (req, res) => {
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

    const cid = await storage.put(files);
    const link = "https://" + cid + ".ipfs.dweb.link/" + filename;

    // remove file stored on server
    fs.unlinkSync(path);

    // store metadata in mongoDB
    const video = new Video({
      originalname,
      filename,
      userId,
      link,
      cid,
      genre,
      tags,
    });

    await video.save();

    return res.json({
      success: true,
      message: "Upload Successfull",
      data: video,
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

const getVideo = async (req, res) => {
  try {
    const id = req.params.id;

    let video = Video.findOne({ _id: id }, { __v: 0 });
    if (video) {
      return res.json({
        success: true,
        data: video,
      });
    }

    return res.json({
      success: false,
      errType: "Invalid Video Id",
      errmessage: "Invalid Video",
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

module.exports = { uploadVideo, getVideo };
