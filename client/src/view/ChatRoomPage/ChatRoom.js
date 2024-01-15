import { useRef, useState, useEffect, useMemo } from "react";
import { Header, Users, ChatInput, MsgList } from "./components/index";
import { io } from "socket.io-client";
import { api } from "../../api/api";

function mergeChunks(chunkArr) {
  let fileStr = "";
  chunkArr.forEach((chunk) => {
    fileStr += chunk.text.join("");
  });
  return { ...chunkArr[chunkArr.length - 1], text: fileStr };
}

const ChatRoom = () => {
  const userInfo = useMemo(() => {
    return JSON.parse(localStorage.getItem("userInfo"));
  }, []);
  const roomId = useMemo(() => {
    return JSON.parse(localStorage.getItem("roomInfo")).roomId;
  }, []);
  const socket = useRef(null);
  const fileChunks = useRef([]);
  const [messages, setMessages] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);

  async function joinRoom(roomId, userInfo) {
    const joinRes = await socket.current.emitWithAck("joinRoom", {
      roomId,
      userInfo,
    });
    const { history } = joinRes;

    const result = [];
    history.forEach((arr) => {
      if (arr[0].type === "text") {
        result.push(arr[0]);
      } else {
        result.push(mergeChunks(arr));
      }
    });

    setMessages((prev) => [...prev, ...result]);
  }

  // http://localhost:9000
  useEffect(() => {
    if (!socket.current) {
      socket.current = io.connect(api, {
        query: {
          roomId,
          userInfo,
        },
      });

      socket.current.on("connect", () => {
        joinRoom(roomId, userInfo);
      });

      socket.current.on("messageToRoom", (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
      });

      socket.current.on("fileToRoom", (fileObj) => {
        fileChunks.current.push(fileObj);
        if (fileObj.lastChunk === "true") {
          console.log(fileChunks.current);
          const fileMsg = mergeChunks(fileChunks.current);
          fileChunks.current = [];
          setMessages((prev) => [...prev, fileMsg]);
        }
      });

      socket.current.on("userAnounce", (data) => {
        setRoomUsers(data.users);
      });

      socket.current.on("disconnect", (reason) => {
        socket.current.emit("leaveRoom", { roomId });
      });

      return () => {
        fileChunks.current = [];
        if (socket.current) {
          socket.current.removeAllListeners();
          socket.current = null;
        }
      };
    }
  }, []);
  return (
    <section className="w-full h-screen flex justify-center items-center">
      <main className="rounded-xl overflow-hidden shadow-md flex flex-col w-full max-w-[500px]">
        <Header roomId={roomId} socket={socket} />
        <Users roomUsers={roomUsers} />
        <MsgList messages={messages} userInfo={userInfo} />
        <ChatInput userInfo={userInfo} socket={socket} />
      </main>
    </section>
  );
};

export default ChatRoom;
