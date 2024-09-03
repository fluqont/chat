import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { User, UserContext } from "../context/UserContext";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

function Root() {
  const [user, setUser] = useState<User | null>(null);

  const { data, error, fetchData } = useFetch();

  useEffect(() => {
    fetchData("/auth");
  }, []);

  useEffect(() => {
    console.log(error);
    if (data && data.user) {
      setUser(data.user);
    }
  }, [data, error]);

  return (
    <UserContext.Provider value={user}>
      <Header />
      <main>
        <Outlet />
      </main>
    </UserContext.Provider>
  );
}

export default Root;
