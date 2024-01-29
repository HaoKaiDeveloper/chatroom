import { Navigate } from "react-router-dom";

function getLocalData(roomInfo, userInfo) {
  if (
    !JSON.parse(localStorage.getItem(roomInfo)) ||
    !JSON.parse(localStorage.getItem(userInfo))
  ) {
    return null;
  }
  return true;
}

const RouteGuard = function ({ children }) {
  const localData = getLocalData("roomInfo", "userInfo");

  if (!localData) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RouteGuard;
