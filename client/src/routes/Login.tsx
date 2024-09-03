import Form from "../components/Form";
import InputField from "../components/InputField";
import useFetch from "../hooks/useFetch";
import { FormEvent } from "react";

export default function Login() {
  const { error, isLoading, fetchData } = useFetch();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = new FormData(event.target as HTMLFormElement);
    fetchData("/auth/login", {
      method: "post",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        username: data.get("username"),
        password: data.get("password"),
      }),
    });
  }

  return (
    <div className="centered-section">
      <h1>log in</h1>
      <Form isLoading={isLoading} method="post" onSubmit={handleSubmit}>
        {error && <p aria-live="polite">{error}</p>}
        <InputField label="username" required autoComplete="username" />
        <InputField
          label="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </Form>
    </div>
  );
}
