import Form from "../components/Form";
import InputField from "../components/InputField";

export default function Signup() {
  return (
    <div className="centered-section">
      <h1>sign up</h1>
      <Form>
        <InputField label="username" />
        <InputField label="password" type="password" />
      </Form>
    </div>
  );
}
