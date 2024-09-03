import classes from "./Form.module.css";
import { FormHTMLAttributes, ReactNode } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  isLoading: boolean;
}

const Form = ({ children, isLoading, ...props }: FormProps) => {
  return (
    <form className={classes.form} {...props}>
      <section className={classes.formMain}>{children}</section>
      <FormNav isLoading={isLoading} />
    </form>
  );
};

interface FormNavProps {
  isLoading: boolean;
}

const FormNav = ({ isLoading }: FormNavProps) => {
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

export default Form;
