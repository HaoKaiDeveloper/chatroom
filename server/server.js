const express = require("express");
const app = express();
const { Server } = require("socket.io");
const cors = require("cors");

const roomRouter = require("./router/roomRouter");
const sendFileRouter = require("./router/snedFileRouter");

const { allRoom } = require("./controller/roomControllers");

app.use(cors());
app.use(express.json());
app.use("/api/room", roomRouter);
app.use("/api/file", sendFileRouter);

const expressServer = app.listen(9000);

// app.get("/", (req, res) => {
//   res.send("hi");
// });

const io = new Server(expressServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connect", (socket) => {
  // console.log("socket connect", socket.id);

  socket.on("joinRoom", async (roomObj, ackCallback) => {
    // console.log("allRoom", allRoom);

    const roomIndex = allRoom.findIndex(
      (room) => room.roomId === roomObj.roomId
    );

    const { userInfo } = roomObj;

    if (roomIndex < 0) {
      return socket.disconnect();
    }
    const thisRoom = allRoom[roomIndex];

    const checkUserInRoom = thisRoom.users.find(
      (user) => user.userId === userInfo.userId
    );

    if (!checkUserInRoom) {
      allRoom.splice(roomIndex, 1, {
        ...thisRoom,
        users: [...thisRoom.users, userInfo],
      });
      thisRoom.users = allRoom[roomIndex].users;
    }

    socket.join(thisRoom.roomId);

    const thisRoomHistory = thisRoom.history;

    const set = new Set(thisRoomHistory.map((obj) => obj.fileId));

    let result = Array.from(set, (id) =>
      thisRoomHistory.filter((obj) => obj.fileId === id)
    );

    result = result.sort((a, b) => {
      return a[0].timestamp - b[0].timestamp;
    });

    io.in(thisRoom.roomId).emit("userAnounce", {
      numUsers: thisRoom.users.length,
      users: thisRoom.users,
    });

    socket.roomId = roomObj.roomId;
    socket.userId = roomObj.userInfo.userId;

    ackCallback({
      history: result,
    });
  });

  socket.on("sendNewMessage", async (msgObj) => {
    // console.log(msgObj);
    const rooms = socket.rooms;
    const currentRoom = [...rooms][1];

    if (!currentRoom) {
      return socket.disconnect();
    }

    const thisRoom = allRoom.find((room) => room.roomId === currentRoom);

    thisRoom.addMessage(msgObj);

    io.in(currentRoom).emit("messageToRoom", msgObj);
  });

  socket.on("sendNewFile", (fileObj) => {
    const rooms = socket.rooms;
    const currentRoom = [...rooms][1];

    const thisRoom = allRoom.find((room) => room.roomId === currentRoom);

    thisRoom.addMessage(fileObj);

    io.in(currentRoom).emit("fileToRoom", fileObj);
  });

  socket.on("leaveRoom", (info) => {
    const { roomId, userInfo } = info;

    if (!roomId || !userInfo) {
      return socket.disconnect();
    }

    const index = allRoom.findIndex((room) => room.roomId === roomId);

    if (index < 0) {
      return socket.disconnect();
    }

    const roomUsers = allRoom[index].users.filter(
      (user) => user.userId !== userInfo.userId
    );

    allRoom.splice(index, 1, { ...allRoom[index], users: roomUsers });

    // console.log("leave", allRoom);

    const rooms = socket.rooms;
    const currentRoom = [...rooms][1];

    socket.leave(roomId);
    io.in(currentRoom).emit("userAnounce", {
      users: allRoom[index].users,
    });
  });

  socket.on("disconnect", () => {
    // console.log("disconnect");
    const { userId, roomId } = socket;

    const index = allRoom.findIndex((room) => room.roomId === roomId);

    if (index < 0) {
      return;
    }

    const roomUsers = allRoom[index].users.filter(
      (user) => user.userId !== userId
    );

    allRoom.splice(index, 1, { ...allRoom[index], users: roomUsers });

    socket.leave(roomId);
    io.in(roomId).emit("userAnounce", {
      users: allRoom[index].users,
    });
  });
});
