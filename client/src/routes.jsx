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
    ],
  },
];

export default routes;
