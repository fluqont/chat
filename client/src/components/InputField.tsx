import classes from "./InputField.module.css";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  textarea?: boolean;
}

const InputField = ({
  label,
  textarea = false,
  ...inputProps
}: InputFieldProps) => {
  return (
    <div className={classes.inputField}>
      <label htmlFor={label} className={classes.label}>
        {label}
      </label>
      <Input
        textarea={textarea}
        {...inputProps}
        name={label}
        id={label}
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
