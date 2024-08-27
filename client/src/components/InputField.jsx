import { string } from "prop-types";
import classes from "./InputField.module.css";

const InputField = ({ label, ...inputProps }) => {
  return (
    <div className={classes.inputField}>
      <label htmlFor={label} className={classes.label}>
        {label}
      </label>
      <input
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
};
export default InputField;
