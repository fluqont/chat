import classes from "./Form.module.css";
import { FormHTMLAttributes, forwardRef, ReactNode } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  isLoading: boolean;
  row?: boolean;
}

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ children, isLoading, row = false, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={[classes.form, row && classes.row].join(" ")}
        {...props}
      >
        <section className={classes.formMain}>{children}</section>
        <FormNav isLoading={isLoading} row={row} />
      </form>
    );
  },
);

interface FormNavProps {
  isLoading: boolean;
  row: boolean;
}

const FormNav = ({ isLoading, row }: FormNavProps) => {
  return (
    <section className={classes.formNav}>
      <button type="submit" className="primary" disabled={isLoading}>
        submit
      </button>
      {!row && (
        <button type="reset" className="error" disabled={isLoading}>
          reset
        </button>
      )}
    </section>
  );
};

export default Form;
