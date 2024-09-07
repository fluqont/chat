import classes from "./Form.module.css";
import {
  CSSProperties,
  FormHTMLAttributes,
  forwardRef,
  ReactNode,
} from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  isLoading: boolean;
  row?: boolean;
  submitLabel?: ReactNode;
  submitStyle?: CSSProperties;
}

const Form = forwardRef<HTMLFormElement, FormProps>(
  (
    {
      children,
      isLoading,
      row = false,
      submitLabel = "submit",
      submitStyle,
      ...props
    },
    ref,
  ) => {
    return (
      <form
        ref={ref}
        className={[classes.form, row && classes.row].join(" ")}
        {...props}
      >
        <section className={classes.formMain}>{children}</section>
        <FormNav
          isLoading={isLoading}
          row={row}
          submitLabel={submitLabel}
          submitStyle={submitStyle}
        />
      </form>
    );
  },
);

interface FormNavProps {
  isLoading: boolean;
  row: boolean;
  submitLabel: ReactNode;
  submitStyle?: CSSProperties;
}

const FormNav = ({
  isLoading,
  row,
  submitLabel,
  submitStyle,
}: FormNavProps) => {
  return (
    <section className={classes.formNav}>
      <button
        type="submit"
        className="primary"
        disabled={isLoading}
        style={submitStyle}
      >
        {submitLabel}
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
