import { createContext } from "react";

export interface User {
  id: number;
  username: string;
}

export const UserContext = createContext<User | null>(null);
