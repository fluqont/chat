import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { UserContext } from "../context/UserContext";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

function Root() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const { data, fetchData } = useFetch();

  useEffect(() => {
    localStorage.setItem("token", token);

    fetchData("/auth", { headers: { Authorization: `Bearer ${token}` } });
  }, [token]);

  useEffect(() => {
    setUser(data?.user);
  }, [data]);

  return (
    <UserContext.Provider value={{ user, token, setToken }}>
      <Header />
      <main>
        <Outlet />
      </main>
    </UserContext.Provider>
  );
}

export default Root;
