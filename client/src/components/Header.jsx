import { Link } from "react-router-dom";
import classes from "./Header.module.css";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Header = () => {
  return (
    <header className={classes.header}>
      <Link to="/" aria-label="home" className={classes.logo}>
        PERP
      </Link>
      <Nav />
    </header>
  );
};

const Nav = () => {
  const { user, setToken } = useContext(UserContext);
  return (
    <nav className={classes.nav}>
      {user ? (
        <>
          <p>{user.username}</p>
          <button className="primary" onClick={() => setToken(null)}>
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
