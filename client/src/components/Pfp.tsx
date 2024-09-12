import classes from "./Pfp.module.css";

const Pfp = ({ url }: { url: string }) => {
  return (
    <img
      src={url}
      width={64}
      height={64}
      className={classes.pfp}
      alt="user's profile picture"
    />
  );
};

export default Pfp;
