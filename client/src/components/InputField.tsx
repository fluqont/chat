import classes from "./InputField.module.css";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  textarea?: boolean;
  displayLabel?: boolean;
}

const InputField = ({
  label,
  id = label,
  textarea = false,
  displayLabel = true,
  ...inputProps
}: InputFieldProps) => {
  return (
    <div className={classes.inputField}>
      <label
        htmlFor={id}
        className={classes.label}
        style={{ visibility: displayLabel ? "visible" : "hidden" }}
      >
        {label}
      </label>
      <Input
        textarea={textarea}
        {...inputProps}
        name={id}
        id={id}
        className={classes.input}
      />
    </div>
  );
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  textarea: boolean;
}

const Input = ({ textarea, ...props }: InputProps) => {
  if (textarea)
    return (
      <textarea
        rows={15}
        {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      ></textarea>
    );
  return <input {...props} />;
};

export default InputField;
