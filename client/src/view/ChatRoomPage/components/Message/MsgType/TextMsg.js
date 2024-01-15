import React from "react";
import MsgWrapper from "../MsgWrapper";

const TextMsg = React.memo(({ text, senderId, userInfo, senderName }) => {
  const classSide = userInfo.userId === senderId ? "self" : "other";

  return (
    <MsgWrapper classSide={classSide}>
      {classSide === "other" && <p className="mb-1">{senderName} : </p>}

      <p className="pl-1">{text}</p>
    </MsgWrapper>
  );
});

export default TextMsg;
