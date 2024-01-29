import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TextMsg from "./TextMsg";

describe("TextMsg component", () => {
  test("render the text message ", () => {
    const props = {
      text: "Hello, this is a test message!",
      senderId: "123",
      userInfo: { userId: "123" },
      senderName: "User1",
    };

    render(<TextMsg {...props} />);

    expect(
      screen.getByText("Hello, this is a test message!")
    ).toBeInTheDocument();
  });
  test("render the sender name if sender is other", () => {
    const props = {
      text: "Another test message",
      senderId: "456", //不同sender
      userInfo: { userId: "123" },
      senderName: "User2",
    };

    render(<TextMsg {...props} />);

    expect(screen.getByText("User2 :")).toBeInTheDocument();
    expect(screen.getByText("Another test message")).toBeInTheDocument();
  });
});
