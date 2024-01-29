import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ZipMsg from "./ZipMsg";
import { downloadZip } from "./ZipMsg";

describe("ZipMsg component", () => {
  test("render the correct file name and size", () => {
    const props = {
      userInfo: { userId: "123" },
      senderId: "123",
      size: 2048,
      fileName: "test.zip",
      senderName: "User1",
      text: "base64data",
    };

    render(<ZipMsg {...props} />);
    expect(screen.getByText("test.zip")).toBeInTheDocument();
    expect(screen.getByText("2.00 KB")).toBeInTheDocument();
  });
  test("creates a link and triggers a click for download", () => {
    const mockAnchor = {
      click: jest.fn(),
      setAttribute: jest.fn(),
      href: "",
      download: "",
    };

    jest.spyOn(document, "createElement").mockImplementation(() => mockAnchor);

    jest.spyOn(document.body, "appendChild").mockImplementation(() => {});
    jest.spyOn(document.body, "removeChild").mockImplementation(() => {});

    const base64Data = "base64data";
    const filename = "test.zip";
    downloadZip(base64Data, filename);

    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(mockAnchor.href).toBe(`data:application/zip;base64,${base64Data}`);
    expect(mockAnchor.download).toBe(filename);

    expect(mockAnchor.click).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor);
    expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);

    jest.restoreAllMocks();
  });
});
