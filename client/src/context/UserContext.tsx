import { createContext, Dispatch, SetStateAction } from "react";

export interface User {
  id: number;
  username: string;
}

interface IUserContext {
  user: User | null;
  token: string | null;
  setToken: Dispatch<SetStateAction<IUserContext["token"]>>;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  token: null,
  setToken: () => {},
});
