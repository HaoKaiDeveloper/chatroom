import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MsgList from "./MsgList";

describe("MsgLis component", () => {
  test("scrolls to the bottom on new messages", () => {
    const messages = [
      {
        type: "text",
        text: "1",
        senderId: "3ca26587-4b0e-434b-b767-560eca8b0bb5",
        senderName: "user1",
        timestamp: 1704185591477,
        fileId: "8993b2f4-ac69-4acd-a8ae-0332636f8e0e",
      },
      {
        type: "text",
        text: "2",
        senderId: "3ca26587-4b0e-434b-b767-560eca8b0bb5",
        senderName: "user1",
        timestamp: 1704185591859,
        fileId: "bc2b0b96-3dec-4648-91c6-fc21fb4b1965",
      },
    ];
    const userInfo = {
      userId: "test1",
      userName: "Alice",
    };

    const { container, debug } = render(
      <MsgList messages={messages} userInfo={userInfo} />
    );
    const msgCtr = container.querySelector(".messagesContainer");
    expect(msgCtr.scrollTop + msgCtr.clientHeight).toEqual(msgCtr.scrollHeight);
  });
});
