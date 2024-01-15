import { useRef } from "react";
import { AiOutlineFileText, AiOutlineSend } from "react-icons/ai";
import { BiImageAlt } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { api } from "../../../api/api";

const ChatInput = ({ socket, userInfo }) => {
  const textRef = useRef(null);
  const fileInputRef = useRef(null);

  function handleTextSubmit(e) {
    e.preventDefault();
    if (textRef.current.value.length < 1) {
      return;
    }
    const fileId = uuidv4();
    const timestamp = new Date().getTime();
    socket.current.emit("sendNewMessage", {
      type: "text",
      text: textRef.current.value,
      senderId: userInfo.userId,
      senderName: userInfo.userName,
      timestamp,
      fileId,
    });
    textRef.current.value = "";
  }

  function clickFileInput() {
    fileInputRef.current.click();
  }

  function fileChange(e) {
    const file = e.target.files[0];
    const type = file.type;
    const imageRegex = /^(image)\//;
    const videoRegex = /^(video)\//;

    if (imageRegex.test(type)) {
      sendImageFile(file);
    } else if (videoRegex.test(type)) {
      sendVideoFile(file);
    } else if (type === "application/x-zip-compressed") {
      sendZipFile(file);
    }
    fileInputRef.current.value = null;
  }

  async function sendImageFile(file) {
    const formData = new FormData();
    formData.append("image", file);
    const fileId = uuidv4();
    const timestamp = new Date().getTime();

    try {
      const res = await axios.post(api + "/api/file/sendImg", formData);
      const loopTimes = Math.ceil(res.data.chunks.length / 3);
      if (res.status === 200) {
        for (let i = 0; i < loopTimes; i++) {
          const start = i * 3;
          const end = start + 3;
          socket.current.emit("sendNewFile", {
            type: "image",
            fileType: res.data.fileType,
            text: res.data.chunks.slice(start, end),
            senderId: userInfo.userId,
            senderName: userInfo.userName,
            timestamp,
            fileId,
            start: i,
            end: loopTimes,
            lastChunk: `${i === loopTimes - 1 ? true : false}`,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function sendVideoFile(file) {
    const formData = new FormData();
    formData.append("video", file);
    const fileId = uuidv4();
    const timestamp = new Date().getTime();

    try {
      const res = await axios.post(api + "/api/file/sendVideo", formData);
      console.log(res);

      const loopTimes = Math.ceil(res.data.chunks.length / 3);
      if (res.status === 200) {
        for (let i = 0; i < loopTimes; i++) {
          const start = i * 3;
          const end = start + 3;
          socket.current.emit("sendNewFile", {
            type: "video",
            fileType: res.data.fileType,
            text: res.data.chunks.slice(start, end),
            senderId: userInfo.userId,
            senderName: userInfo.userName,
            timestamp,
            fileId,
            start: i,
            end: loopTimes,
            lastChunk: `${i === loopTimes - 1 ? true : false}`,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function sendZipFile(file) {
    const formData = new FormData();
    const encodedFilename = encodeURIComponent(file.name);

    formData.append("zip", file, encodedFilename);
    const fileId = uuidv4();
    const timestamp = new Date().getTime();

    try {
      const res = await axios.post(api + "/api/file/sendZipFile", formData);
      const loopTimes = Math.ceil(res.data.chunks.length / 3);
      if (res.status === 200) {
        for (let i = 0; i < loopTimes; i++) {
          const start = i * 3;
          const end = start + 3;
          socket.current.emit("sendNewFile", {
            type: "zip",
            text: res.data.chunks.slice(start, end),
            senderId: userInfo.userId,
            senderName: userInfo.userName,
            timestamp,
            fileId,
            fileName: res.data.fileName,
            size: res.data.size,
            start: i,
            end: loopTimes,
            lastChunk: `${i === loopTimes - 1 ? true : false}`,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <form
      onSubmit={handleTextSubmit}
      className="w-full h-[40px] px-3 bg-grey1 flex justify-between items-center gap-3 text-grey3 text-2xl"
    >
      <button
        type="button"
        className="hover:text-primary"
        onClick={clickFileInput}
      >
        <AiOutlineFileText />
      </button>

      <button
        type="button"
        className="hover:text-primary"
        onClick={clickFileInput}
      >
        <BiImageAlt />
      </button>

      <input
        type="text"
        ref={textRef}
        className="text-lg flex-1 h-[90%] p-2 outline-none border border-grey3 rounded-md"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={fileChange}
        className="hidden"
      />
      <button type="submit" className="hover:text-primary">
        <AiOutlineSend />
      </button>
    </form>
  );
};

export default ChatInput;
