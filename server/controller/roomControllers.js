const { v4: uuidv4 } = require("uuid");

const allRoom = [];

function checkRoomExiste(roomId) {
  const roomIndex = allRoom.findIndex((room) => room.roomId === roomId);
  return roomIndex;
}

function checkPassword(roomIndex, password) {
  let auth;
  const room = allRoom[roomIndex];

  if (!room) {
    return (auth = false);
  }
  if (room.roomPassword === password) {
    auth = true;
  } else if (room.roomPassword !== password) {
    auth = false;
  }
  return auth;
}

const createNewRoom = async (req, res) => {
  const { userName, userId, roomPassword } = req.body;
  if (!userName || !userId || !roomPassword) {
    return res.status(200).json({ statusCode: 9999, msg: "缺少資訊" });
  }

  const newRoom = {
    roomId: uuidv4(),
    roomPassword,
    users: [{ userName, userId }],
    history: [],
    addMessage(message) {
      this.history.push(message);
    },
    addUsers(userObj) {
      this.users.push(userObj);
    },
  };

  allRoom.push(newRoom);
  res.status(200).json({
    statusCode: "0000",
    msg: "",
    roomInfo: { roomId: newRoom.roomId },
    userInfo: { userId, userName },
  });
};

const joinRoom = async (req, res) => {
  const { userName, userId, roomId, roomPassword } = req.body;
  if (!userName || !userId || !roomId || !roomPassword) {
    return res.status(200).json({ statusCode: 9999, msg: "缺少資訊" });
  }

  const roomIndex = checkRoomExiste(roomId);
  const auth = checkPassword(roomIndex, roomPassword);
  if (roomIndex < 0 || !auth) {
    return res
      .status(200)
      .json({ statusCode: 9999, msg: "Room information error." });
  }

  const updataRoomUsers = { ...allRoom[roomIndex] };
  updataRoomUsers.addUsers({ userName, userId });

  allRoom.splice(roomIndex, 1, updataRoomUsers);

  res.status(200).json({
    statusCode: "0000",
    msg: "",
    roomInfo: { roomId: updataRoomUsers.roomId },
    userInfo: { userId, userName },
  });
};

const leaveRoom = async (req, res) => {
  const {
    roomId,
    userInfo: { userId },
  } = req.body;

  const roomIndex = allRoom.findIndex((room) => room.roomId === roomId);
  if (roomIndex < 0) {
    return res.status(400).json({
      statusCode: "9999",
    });
  }

  const thisRoom = allRoom[roomIndex];

  thisRoom.users = thisRoom.users.filter((user) => user.userId !== userId);

  if (thisRoom.users.length < 1) {
    allRoom.splice(roomIndex, 1);
    return res.status(200).json({
      statusCode: "0000",
      allRoom,
    });
  }

  allRoom.splice(roomIndex, 1, thisRoom);

  console.log(allRoom);

  res.status(200).json({
    statusCode: "0000",
    allRoom,
  });
};

module.exports = {
  createNewRoom,
  joinRoom,
  leaveRoom,
  allRoom,
};
