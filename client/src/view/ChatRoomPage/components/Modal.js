import React from "react";
import ReactDOM from "react-dom";

const Backdrop = (props) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-[100vh] z-20 bg-black/75"
      onClick={props.onClose}
    ></div>
  );
};

const ModalOverlay = (props) => {
  return (
    <div
      className={`${"fixed top-[20vh] left-[40%] w-[20%] bg-white  px-[30px] py-[20px] rounded-[14px] z-30"} animate-slide-down ${
        props.className
      }`}
    >
      {props.children}
    </div>
  );
};

const portalElement = document.querySelector("#overlays");

const Modal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay className={props.className}>
          {props.children}
        </ModalOverlay>,
        portalElement
      )}
    </>
  );
};

export default Modal;
