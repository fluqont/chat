import classes from "./Header.module.css";

const Header = () => {
  return (
    <header className={classes.header}>
      <a href="/" aria-label="home" className={classes.logo}>
        PERP
      </a>
      <Nav />
    </header>
  );
};

const Nav = () => {
  return (
    <nav className={classes.nav}>
      <a href="/login">log in</a>
      <a href="/signup" className="link-button primary">
        sign up
      </a>
    </nav>
  );
};

export default Header;
