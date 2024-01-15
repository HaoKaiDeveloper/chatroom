function getBase64Chunks(buffer) {
  const base64Image = buffer.toString("base64");

  const chunkSize = 64 * 1024;

  const totalChunks = Math.ceil(base64Image.length / chunkSize);

  const chunks = [];
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    chunks.push(base64Image.substring(start, end));
  }
  return chunks;
}

const sendImg = async (req, res) => {
  const chunks = getBase64Chunks(req.file.buffer);
  // console.log(req.file);
  res
    .status(200)
    .json({ statusCode: "0000", chunks, fileType: req.file.mimetype });
};

const sendVideo = async (req, res) => {
  const chunks = getBase64Chunks(req.file.buffer);
  res
    .status(200)
    .json({ statusCode: "0000", chunks, fileType: req.file.mimetype });
};

const sendZipFile = async (req, res) => {
  const chunks = getBase64Chunks(req.file.buffer);

  res.status(200).json({
    statusCode: "0000",
    chunks,
    fileName: req.file.originalname,
    size: req.file.size,
    fileType: "zip",
  });
};

module.exports = {
  sendImg,
  sendVideo,
  sendZipFile,
};
