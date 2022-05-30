const multer = require("multer");
const upload = multer({ dest: "./temp/data/uploads/" });

module.exports = { upload };
