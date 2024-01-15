import React, { useEffect, useState } from "react";
import { AiOutlineCopy } from "react-icons/ai";
import { BsCheckAll } from "react-icons/bs";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

const Header = React.memo(({ roomId, socket }) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [copyState, setCopyState] = useState(false);

  function toggleOpenModal() {
    setOpenModal(!openModal);
  }

  function copyRoomId() {
    const str = roomId;
    const tempInput = document.createElement("input");
    tempInput.value = str;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    setCopyState(true);
  }

  async function handleLeaveRoom() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    socket.current.emit("leaveRoom", { roomId, userInfo });
    localStorage.clear();
    navigate("/");
  }

  useEffect(() => {
    let copyTimeOut;
    if (copyState === true) {
      console.log("copy");
      copyTimeOut = setTimeout(() => {
        setCopyState(false);
      }, 1500);
    }

    return () => {
      clearTimeout(copyTimeOut);
    };
  }, [copyState]);

  return (
    <>
      <header className="flex justify-between items-center p-2 bg-primary text-grey1">
        <div className="flex gap-3 items-center">
          <p>Room Id : {roomId.slice(0, 10)} ...</p>
          <button
            type="button"
            onClick={copyRoomId}
            className="px-3 py-1 border border-white rounded-md hover:bg-grey1 hover:text-primary"
          >
            {!copyState ? <AiOutlineCopy /> : <BsCheckAll />}
          </button>
        </div>
        <button
          type="button"
          className="px-3 py-1 border border-white rounded-md hover:bg-grey1 hover:text-primary"
          onClick={toggleOpenModal}
        >
          離開
        </button>
      </header>

      {openModal && (
        <Modal
          onClose={toggleOpenModal}
          className="flex flex-col items-center justify-center gap-3 p-3"
        >
          <p className="text-lg">確認離開?</p>
          <button
            type="button"
            className="px-3 py-1 text-primary shadow-md bg-grey1 rounded-lg hover:bg-primary hover:text-grey1 text-base"
            onClick={handleLeaveRoom}
          >
            確認
          </button>
        </Modal>
      )}
    </>
  );
});

export default Header;
