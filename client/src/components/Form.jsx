import { node } from "prop-types";
import classes from "./Form.module.css";

const Form = ({ children }) => {
  return (
    <form action="" className={classes.form}>
      <section className={classes.formMain}>{children}</section>
      <FormNav />
    </form>
  );
};
Form.propTypes = {
  children: node,
};

const FormNav = () => {
  return (
    <section className={classes.formNav}>
      <button type="submit" className="primary">
        submit
      </button>
      <button type="reset" className="error">
        reset
      </button>
    </section>
  );
};

export default Form;
