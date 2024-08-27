import Form from "../components/Form";
import InputField from "../components/InputField";

export default function Login() {
  return (
    <div className="centered-section">
      <h1>log in</h1>
      <Form>
        <InputField label="username" />
        <InputField label="password" type="password" />
      </Form>
    </div>
  );
}
