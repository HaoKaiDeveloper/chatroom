const router = require("express").Router();

const {
  createNewRoom,
  joinRoom,
  leaveRoom,
} = require("../controller/roomControllers");

router.post("/createRoom", createNewRoom);
router.post("/joinRoom", joinRoom);
router.post("/leaveRoom", leaveRoom);

module.exports = router;
