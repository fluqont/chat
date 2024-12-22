import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import useFetch from "../hooks/useFetch";
import { io, Socket } from "socket.io-client";

export interface User {
  id: number;
  username: string;
  pfpUrl: string;
  status: "ONLINE" | "OFFLINE";
  friendshipStatus: "friend" | "waits for your answer" | "request sent" | null;
}

interface IUserContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<IUserContext["user"]>>;
  socket: Socket | null;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {},
  socket: null,
});

const Context = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<null | User>(null);
  const [socket, setSocket] = useState<null | Socket>(null);

  const { data, fetchData } = useFetch();

  useEffect(() => {
    fetchData("/auth", { credentials: "include" });
  }, []);

  useEffect(() => {
    if (data && data.user) {
      setUser(data.user);

      const socket = io(import.meta.env.VITE_BASE_URL, {
        auth: { token: data.user.id },
      });
      setSocket(socket);
    }
  }, [data]);

  return (
    <UserContext.Provider value={{ user, setUser, socket }}>
      {children}
    </UserContext.Provider>
  );
};

export default Context;
