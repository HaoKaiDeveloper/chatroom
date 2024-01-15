import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

jest.mock("axios");
jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

async function submitUserInfo(userInfo, newRoom, setErrMsg, navigate) {
  let url = "http://localhost:9000";
  if (!userInfo.userName || !userInfo.roomPassword) {
    return setErrMsg("請輸入完整資訊");
  }

  if (newRoom) {
    url = url + "/api/room/joinRoom";
    if (!userInfo.roomId) {
      return setErrMsg("請輸入完整資訊");
    }
  } else {
    url = url + "/api/room/createRoom";
  }

  try {
    const res = await axios.post(url, { ...userInfo, userId: uuidv4() });
    if (res.status === 200) {
      const { data } = res;
      if (data.statusCode === "0000") {
        localStorage.setItem("roomInfo", JSON.stringify(data.roomInfo));
        localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
        navigate("/chatroom");
      } else {
        setErrMsg(res.data.msg);
      }
    }
    console.log(res);
  } catch (err) {
    setErrMsg("Room information error.");
  }
}

describe("LoginPage", () => {
  test("toggle newRoom state", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    const toggleBtn = screen.getByRole("button", { name: /加入聊天室/i });

    expect(screen.getByText("新增聊天室")).toBeInTheDocument();
    expect(screen.queryByText("房間ID")).not.toBeInTheDocument();
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);

    expect(screen.getByText("加入聊天")).toBeInTheDocument();
    expect(screen.getByLabelText("房間ID :")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /新增新房間/i })
    ).toBeInTheDocument();
  });

  test("shows error message if the form is incomplete", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { statusCode: "0000", roomInfo: {}, userInfo: {} },
    });
    const mockSetError = jest.fn();
    const mockNavigate = jest.fn();

    const userInfo_1 = {
      userName: "user1",
      roomPassword: "",
    };

    await submitUserInfo(userInfo_1, false, mockSetError, mockNavigate);
    expect(mockSetError).toHaveBeenCalledWith("請輸入完整資訊");
    expect(mockNavigate).not.toHaveBeenCalled();

    const userInfo_2 = {
      userName: "user1",
      roomPassword: "123",
      roomId: "",
    };
    await submitUserInfo(userInfo_2, true, mockSetError, mockNavigate);
    expect(mockSetError).toHaveBeenCalledWith("請輸入完整資訊");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("navigates to chatroom on successful submission", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { statusCode: "0000", roomInfo: {}, userInfo: {} },
    });

    const mockSetErrMsg = jest.fn();
    const mockNavigate = jest.fn();

    const userInfo = {
      userName: "testuser",
      roomPassword: "password",
    };

    await submitUserInfo(userInfo, false, mockSetErrMsg, mockNavigate);

    expect(mockNavigate).toHaveBeenCalledWith("/chatroom");
  });
});
