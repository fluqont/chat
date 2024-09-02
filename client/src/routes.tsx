import { RouteObject } from "react-router-dom";
import Login from "./routes/Login";
import Root from "./routes/Root";
import Signup from "./routes/Signup";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
] as const;

export default routes;
