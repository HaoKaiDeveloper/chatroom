import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./view/LoginPage/LoginPage.js";
import ChatRoom from "./view/ChatRoomPage/ChatRoom.js";
import RouteGuard from "./view/RouteGuard.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    children: [],
  },
  {
    path: "/chatroom",
    element: (
      <RouteGuard>
        <ChatRoom />
      </RouteGuard>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
