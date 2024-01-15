import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosEye } from "react-icons/io";
import { BsEyeSlashFill } from "react-icons/bs";
import FormInput from "../../components/FormInput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { api } from "../../api/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [openPassword, setOpenPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userName: "",
    userId: "",
    roomId: "",
    roomPassword: "",
  });
  const [newRoom, setNewRoom] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  function userInfoChange(e) {
    setUserInfo((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function submitUserInfo(e) {
    e.preventDefault();
    let url = api;
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

  useEffect(() => {
    let setMsg;
    if (errMsg) {
      setMsg = setTimeout(() => {
        setErrMsg("");
      }, 2000);
    }
    return () => clearTimeout(setMsg);
  }, [errMsg]);

  return (
    <section className="w-full h-[100vh] flex justify-center items-center">
      <form
        onSubmit={submitUserInfo}
        className="w-[40%] min-w-[275px] p-5 shadow-lg rounded-xl flex flex-col justify-center gap-2"
      >
        <h1 className="text-center text-primary text-3xl font-bold tracking-wide">
          {newRoom ? "加入聊天" : "新增聊天室 "}
        </h1>
        <FormInput
          labelName="用戶名稱"
          id="name"
          type="text"
          inputName="userName"
          value={userInfo.name}
          handleChange={userInfoChange}
        />
        {newRoom && (
          <FormInput
            labelName="房間ID"
            id="roomId"
            type="text"
            inputName="roomId"
            value={userInfo.roomId}
            handleChange={userInfoChange}
          />
        )}
        <div className="relative">
          <FormInput
            labelName="房間密碼"
            id="password"
            type={openPassword ? "text" : "password"}
            inputName="roomPassword"
            value={userInfo.roomPassword}
            handleChange={userInfoChange}
          />
          <button
            type="button"
            onClick={() => setOpenPassword(!openPassword)}
            className="absolute right-4 bottom-[5px] text-2xl"
          >
            {openPassword ? <BsEyeSlashFill /> : <IoIosEye />}
          </button>
        </div>

        <div className="mx-auto min-h-[25px] block">
          <p>{errMsg}</p>
        </div>

        <div className="w-full flex justify-center relative">
          <button
            type="submit"
            className="text-xl bg-primary tracking-wide text-white px-4 py-1 rounded-[7px]"
          >
            {newRoom ? "進入" : "新增"}
          </button>
          <button
            type="button"
            onClick={() => setNewRoom(!newRoom)}
            className="absolute right-0 bottom-0 text-base text-stone-700 border-b border-dotted "
          >
            {newRoom ? "新增新房間" : "加入聊天室"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default LoginPage;
