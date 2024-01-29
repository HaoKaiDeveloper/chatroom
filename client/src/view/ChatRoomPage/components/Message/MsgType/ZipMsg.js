import React from "react";
import { AiOutlineFileText } from "react-icons/ai";
import MsgWrapper from "../MsgWrapper";

export function downloadZip(base64Data, filename) {
  const link = document.createElement("a");
  link.href = `data:application/zip;base64,${base64Data}`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function calcFileSize(size) {
  let fileSize = "";
  if (size < 1024) {
    fileSize = size + "B";
  } else if (size < 1048576) {
    fileSize = `${(size / 1024).toFixed(2)} KB`;
  } else {
    fileSize = `${(size / 104876).toFixed(2)} MB`;
  }
  return fileSize;
}

const ZipMsg = React.memo(
  ({ userInfo, senderId, size, fileName, senderName, text }) => {
    const classSide = userInfo.userId === senderId ? "self" : "other";

    return (
      <MsgWrapper classSide={classSide}>
        {classSide === "other" && <p className="mb-1">{senderName} : </p>}
        <article className="flex flex-col gap-2">
          <p className="text-base text-stone-600 font-semibold">{fileName}</p>
          <p className="flex items-center justify-end">
            <AiOutlineFileText />
            <span>{calcFileSize(size)}</span>
          </p>
          <button
            type="button"
            onClick={() => downloadZip(text, fileName)}
            className="text-sky-700 border rounded-md hover:bg-stone-100"
          >
            Download
          </button>
        </article>
      </MsgWrapper>
    );
  }
);

export default ZipMsg;
