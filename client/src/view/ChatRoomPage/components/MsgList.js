import React, { useRef, useEffect } from "react";
import { MediaMsg, TextMsg, ZipMsg } from "./Message/MsgType";

const MsgList = React.memo(({ messages, userInfo }) => {
  const messagesContainer = useRef(null);

  console.log(messages);
  useEffect(() => {
    messagesContainer.current.scrollTop =
      messagesContainer.current.scrollHeight;
  }, [messages]);

  return (
    <div>
      <div
        className="w-full h-[400px] p-2 overflow-y-scroll flex flex-col gap-5 scroll-smooth messagesContainer"
        ref={messagesContainer}
      >
        {messages.map((msg) => {
          if (msg.type === "text") {
            return <TextMsg userInfo={userInfo} key={msg.fileId} {...msg} />;
          } else if (msg.type === "image" || msg.type === "video") {
            return <MediaMsg userInfo={userInfo} key={msg.fileId} {...msg} />;
          } else if (msg.type === "zip") {
            return <ZipMsg userInfo={userInfo} key={msg.fileId} {...msg} />;
          }
        })}
      </div>
    </div>
  );
});

export default MsgList;
