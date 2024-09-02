import { bool, string } from "prop-types";
import classes from "./InputField.module.css";

const InputField = ({ label, textarea = false, ...inputProps }) => {
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
InputField.propTypes = {
  label: string,
  textarea: bool,
};

const Input = ({ textarea, ...props }) => {
  if (textarea) return <textarea rows={15} {...props}></textarea>;
  return <input {...props} />;
};
Input.propTypes = {
  textarea: bool,
};

export default InputField;
