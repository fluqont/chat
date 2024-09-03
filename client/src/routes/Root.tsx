import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import UserContext from "../context/UserContext";

function Root() {
  return (
    <UserContext>
      <Header />
      <main>
        <Outlet />
      </main>
    </UserContext>
  );
}

export default Root;
