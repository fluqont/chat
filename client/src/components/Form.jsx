import { bool, node } from "prop-types";
import classes from "./Form.module.css";

const Form = ({ children, isLoading, ...props }) => {
  return (
    <form className={classes.form} {...props}>
      <section className={classes.formMain}>{children}</section>
      <FormNav isLoading={isLoading} />
    </form>
  );
};
Form.propTypes = {
  children: node,
  isLoading: bool,
};

const FormNav = ({ isLoading }) => {
  return (
    <section className={classes.formNav}>
      <button type="submit" className="primary" disabled={isLoading}>
        submit
      </button>
      <button type="reset" className="error" disabled={isLoading}>
        reset
      </button>
    </section>
  );
};
FormNav.propTypes = {
  isLoading: bool,
};

export default Form;
