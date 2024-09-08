import { Link, useNavigate } from "react-router-dom";
import classes from "./Header.module.css";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import useFetch from "../hooks/useFetch";
import { MessageCircle, Search } from "lucide-react";

const Header = () => {
  return (
    <header className={classes.header}>
      <Link to="/" aria-label="home" className={classes.logo}>
        <MessageCircle size={24} strokeWidth={3} />
        chat
      </Link>
      <Link
        to="/search"
        className={["link-button surface", classes.search].join(" ")}
        aria-label="search"
      >
        <Search size={20} />
        <span>Search</span>
      </Link>
      <Nav />
    </header>
  );
};

const Nav = () => {
  const navigate = useNavigate();

  const { data, fetchData } = useFetch();

  const { user, setUser } = useContext(UserContext);
  function logout() {
    fetchData("/auth/logout", { credentials: "include" });
  }

  useEffect(() => {
    if (data && data.message === "OK") {
      setUser(null);
      navigate("/");
    }
  }, [data]);
  return (
    <nav className={classes.nav}>
      {user ? (
        <>
          <Link to="/user">{user.username}</Link>
          <button className="primary" onClick={logout}>
            log out
          </button>
        </>
      ) : (
        <>
          <Link to="/login">log in</Link>
          <Link to="/signup" className="link-button primary">
            sign up
          </Link>
        </>
      )}
    </nav>
  );
};

export default Header;
