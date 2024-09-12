import classes from "./InputField.module.css";
import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  textarea?: boolean;
  displayLabel?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { label, id = label, textarea = false, displayLabel = true, ...inputProps },
    ref,
  ) => {
    return (
      <div className={classes.inputField}>
        <label
          htmlFor={id}
          className={classes.label}
          style={{ display: !displayLabel ? "none" : "" }}
        >
          {label}
        </label>
        <Input
          textarea={textarea}
          {...inputProps}
          name={id}
          id={id}
          className={classes.input}
          ref={ref}
        />
      </div>
    );
  },
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  textarea: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ textarea, ...props }, ref) => {
    if (textarea)
      return (
        <textarea
          rows={15}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        ></textarea>
      );
    return <input ref={ref} {...props} />;
  },
);

export default InputField;
