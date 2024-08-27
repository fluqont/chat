import { Link } from "react-router-dom";
import classes from "./Header.module.css";

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
  return (
    <nav className={classes.nav}>
      <Link to="/login">log in</Link>
      <Link to="/signup" className="link-button primary">
        sign up
      </Link>
    </nav>
  );
};

export default Header;
