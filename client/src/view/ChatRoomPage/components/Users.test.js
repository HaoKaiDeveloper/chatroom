import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Users from "./Users";

describe("Users Component", () => {
  test("render correctly", () => {
    const roomUsers = [
      { userId: "test1", userName: "Alice" },
      { userId: "test2", userName: "Bob" },
    ];

    render(<Users roomUsers={roomUsers} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });
});
