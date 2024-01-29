import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RouteGuard from "./RouteGuard";
import LoginPage from "./LoginPage/LoginPage";
import "@testing-library/jest-dom";

const mockLocalStorage = (userInfo, roomInfo) => {
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "userInfo") return userInfo ? JSON.stringify(userInfo) : null;
    if (key === "roomInfo") return roomInfo ? JSON.stringify(roomInfo) : null;
    return null;
  });
};

const TestComponent = () => <div>TestComponent</div>;

describe("RouteGuard Component", () => {
  it("should redirect to home page when either userInfo or roomInfo is missing", () => {
    mockLocalStorage(null, { roomId: "fjkslfjlks14gf" });

    render(
      <MemoryRouter initialEntries={["/chatroom"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/chatroom"
            element={
              <RouteGuard>
                <TestComponent />
              </RouteGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("新增聊天室")).toBeInTheDocument();
  });

  it("should render TestComponent when both userInfo and roomInfo are present", () => {
    mockLocalStorage(
      { userId: "testuserId", userName: "user1" },
      { roomId: "testId" }
    );

    render(
      <MemoryRouter initialEntries={["/chatroom"]}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/chatroom"
            element={
              <RouteGuard>
                <TestComponent />
              </RouteGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("TestComponent")).toBeInTheDocument();
  });
});
