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
    }
  }, [data]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default Context;
