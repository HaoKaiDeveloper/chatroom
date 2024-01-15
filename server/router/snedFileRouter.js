const router = require("express").Router();

const {
  sendImg,
  sendVideo,
  sendZipFile,
} = require("../controller/fileControllers");

const multer = require("multer");
const uploadFile = multer();

router.post("/sendImg", uploadFile.single("image"), sendImg);
router.post("/sendVideo", uploadFile.single("video"), sendVideo);
router.post("/sendZipFile", uploadFile.single("zip"), sendZipFile);

module.exports = router;
