import classes from "./Form.module.css";
import {
  ButtonHTMLAttributes,
  CSSProperties,
  FormHTMLAttributes,
  forwardRef,
  ReactNode,
} from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  isLoading: boolean;
  row?: boolean;
  submitProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ children, isLoading, row = false, submitProps, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={[classes.form, row && classes.row].join(" ")}
        {...props}
      >
        <section className={classes.formMain}>{children}</section>
        <FormNav isLoading={isLoading} row={row} submitProps={submitProps} />
      </form>
    );
  },
);

interface FormNavProps {
  isLoading: boolean;
  row: boolean;
  submitProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

const FormNav = ({ isLoading, row, submitProps }: FormNavProps) => {
  return (
    <section className={classes.formNav}>
      <button
        type="submit"
        className="primary"
        disabled={isLoading}
        {...submitProps}
      >
        {submitProps?.children ?? "submit"}
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
