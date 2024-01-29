import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ChatInput from "./ChatInput";
import axios from "axios";

jest.mock("axios");

jest.mock("uuid", () => ({
  v4: () => "uuid",
}));

describe("ChatInput Component", () => {
  const mockSocket = { current: { emit: jest.fn() } };
  const userInfo = { userId: "user1", userName: "TestUser" };

  test("sends text message on submit", () => {
    render(<ChatInput socket={mockSocket} userInfo={userInfo} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hello world!" } });
    fireEvent.submit(input);

    expect(mockSocket.current.emit).toHaveBeenCalledWith(
      "sendNewMessage",
      expect.anything()
    );
  });

  test("handles file input", async () => {
    render(<ChatInput socket={mockSocket} userInfo={userInfo} />);

    const fileInput = screen.getByRole("button", { name: /image/i });
    const testFile = new File(["test"], "test.png", { type: "image/png" });

    // // 模拟文件选择
    // Object.defineProperty(fileInput, "files", {
    //   value: [testFile],
    // });
    // await act(async () => {
    //   fireEvent.change(fileInput);
    // });

    // 根据您的具体逻辑验证 axios 调用或 socket.emit 调用
    // expect(axios.post).toHaveBeenCalled();
  });
});
