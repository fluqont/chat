import { RouteObject } from "react-router-dom";
import Login from "./routes/Login";
import Root from "./routes/Root";
import Signup from "./routes/Signup";
import User from "./routes/User";
import Search from "./routes/Search";
import MessagesWithChats from "./routes/MessagesWithChats";
import NewGroup from "./routes/NewGroup";
import GroupRequest from "./routes/GroupRequest";
import EditGroup from "./routes/EditGroup";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <MessagesWithChats key={1} /> },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/new-group",
        element: <NewGroup />,
      },
      {
        path: "/groups/:groupId/request",
        element: <GroupRequest />,
      },
      {
        path: "/groups/:groupId/edit",
        element: <EditGroup />,
      },
    ],
  },
] as const;

export default routes;
