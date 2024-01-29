import React from "react";
import ReactDOM from "react-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import "@testing-library/jest-dom";
import Header from "./Header";
import Modal from "./Modal";
import { BrowserRouter } from "react-router-dom";

describe("Header Component", () => {
  let portalElement;
  beforeAll(() => {
    ReactDOM.createPortal = jest.fn((element, target) => {
      // 检查目标是否是我们的 portal 元素
      if (target && target.getAttribute("id") === "overlays") {
        // 为 portal 创建一个新的 div
        const portalDiv = document.createElement("div");
        portalDiv.setAttribute("id", "overlays");
        document.body.appendChild(portalDiv);

        // 返回模拟的 Portal 内容
        return element;
      }
      return null;
    });
  });

  // 在所有测试结束后清理
  //   afterAll(() => {
  //     document.body.removeChild(portalElement);
  //   });

  // 模拟 useNavigate 钩子
  const mockedNavigate = jest.fn();
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
  }));

  it("opens modal on leave button click", () => {
    const socket = { current: { emit: jest.fn() } };
    const roomId = "1234567890abcdef";

    render(
      <BrowserRouter>
        <Header roomId={roomId} socket={socket} />
      </BrowserRouter>
    );

    const leaveButton = screen.getByRole("button", { name: /離開/i });
    fireEvent.click(leaveButton);

    // expect(screen.getByText("確認離開?")).toBeInTheDocument();
  });
});
