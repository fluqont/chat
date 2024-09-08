import { RouteObject } from "react-router-dom";
import Login from "./routes/Login";
import Root from "./routes/Root";
import Signup from "./routes/Signup";
import User from "./routes/User";
import Search from "./routes/Search";
import MessagesWithChats from "./routes/MessagesWithChats";
import NewGroup from "./routes/NewGroup";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <MessagesWithChats /> },
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
    ],
  },
] as const;

export default routes;
