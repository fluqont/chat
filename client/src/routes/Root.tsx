import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import UserContext from "../context/UserContext";
import WsContextWrapper from "../context/WsContext";

function Root() {
  return (
    <UserContext>
      <WsContextWrapper>
        <Header />
        <main>
          <Outlet />
        </main>
      </WsContextWrapper>
    </UserContext>
  );
}

export default Root;
