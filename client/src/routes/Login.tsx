import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import InputField from "../components/InputField";
import useFetch from "../hooks/useFetch";
import { FormEvent, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { data, error, isLoading, fetchData } = useFetch();

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

  const { setUser } = useContext(UserContext);
  useEffect(() => {
    if (data) {
      setUser(data.user);
      navigate("/");
    }
  }, [data]);

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
