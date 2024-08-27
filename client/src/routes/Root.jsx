import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { UserContext } from "../context/UserContext";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

function Root() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const { data, fire } = useFetch();

  useEffect(() => {
    localStorage.setItem("token", token);

    fire("/auth", { headers: { Authorization: `Bearer ${token}` } });
  }, [token]);

  useEffect(() => {
    setUser(data?.user);
    console.log("Data changed: ", data);
  }, [data]);

  return (
    <UserContext.Provider value={{ user, setToken }}>
      <Header />
      <main>
        <Outlet />
      </main>
    </UserContext.Provider>
  );
}

export default Root;
