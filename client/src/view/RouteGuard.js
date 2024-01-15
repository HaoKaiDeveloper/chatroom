import { Navigate } from "react-router-dom";

const RouteGuard = function ({ children }) {
  const localRoomInfo = JSON.parse(localStorage.getItem("roomInfo"));
  const localUserInfo = JSON.parse(localStorage.getItem("userInfo"));

  // if (!localRoomInfo || !localUserInfo) {
  //   return <Navigate to="/" />;
  // }

  return children;
};

export default RouteGuard;
