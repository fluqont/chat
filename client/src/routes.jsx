import Login from "./routes/Login";
import Root from "./routes/Root";
import Signup from "./routes/Signup";

const routes = [
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
];

export default routes;
