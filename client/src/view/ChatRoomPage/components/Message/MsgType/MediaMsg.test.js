import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MediaMsg from "./MediaMsg";

describe("MediaMsg component", () => {
  test("render an image when type is image", () => {
    const props = {
      fileType: "image/png",
      senderId: "123",
      userInfo: { userId: "123" },
      senderName: "User1",
      type: "image",
      text: "base64imageString",
    };

    render(<MediaMsg {...props} />);

    expect(screen.getByAltText("img")).toBeInTheDocument();
    expect(screen.getByAltText("img").tagName).toBe("IMG");
  });

  test("render an video when type is video", () => {
    const props = {
      fileType: "video/mp4",
      senderId: "123",
      userInfo: { userId: "456" },
      senderName: "User2",
      type: "video",
      text: "base64videoString",
    };

    const { container } = render(<MediaMsg {...props} />);

    const videoElement = container.querySelector("video");

    expect(videoElement).toBeInTheDocument();
    expect(videoElement.tagName).toBe("VIDEO");
  });
});
