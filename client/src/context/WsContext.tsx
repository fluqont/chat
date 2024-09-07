import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

const ws = new WebSocket(import.meta.env.VITE_API_URL);
export const WsContext = createContext(ws);

const WsContextWrapper = ({ children }: PropsWithChildren) => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      ws.send("open");
    }
  }, [user]);

  return <WsContext.Provider value={ws}>{children}</WsContext.Provider>;
};

export default WsContextWrapper;
