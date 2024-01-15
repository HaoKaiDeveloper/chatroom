import React from "react";
import MsgWrapper from "../MsgWrapper";

const MediaMsg = React.memo(
  ({ fileType, senderId, userInfo, senderName, type, text }) => {
    const classSide = userInfo.userId === senderId ? "self" : "other";

    return (
      <MsgWrapper classSide={classSide}>
        {classSide === "other" && <p className="mb-1">{senderName} : </p>}

        {type === "image" ? (
          <img
            src={`data:${fileType};base64,${text}`}
            alt="img"
            className="h-[200px]"
          />
        ) : (
          <video controls className="h-[200px]">
            <source src={`data:${fileType};base64,${text}`} />
          </video>
        )}
      </MsgWrapper>
    );
  }
);

export default MediaMsg;
