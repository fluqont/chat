import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import useFetch from "../hooks/useFetch";

export interface User {
  id: number;
  username: string;
  friendshipStatus: "friend" | "waits for your answer" | "request sent" | null;
}

interface IUserContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<IUserContext["user"]>>;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {},
});

const Context = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<null | User>(null);

  const { data, fetchData } = useFetch();

  useEffect(() => {
    fetchData("/auth", { credentials: "include" });
  }, []);

  useEffect(() => {
    if (data && data.user) {
      setUser(data.user);

      const ws = new WebSocket(
        `${import.meta.env.VITE_WS_URL}?partnerId=${data.user.id}`,
      );
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "status", data: "ONLINE" }));
      };

      return () => ws.close();
    }
  }, [data]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default Context;
