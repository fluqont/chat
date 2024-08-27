import Form from "../components/Form";
import InputField from "../components/InputField";
import useFetch from "../hooks/useFetch";

export default function Signup() {
  const { data, error, isLoading, fire } = useFetch();
  function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target);
    console.log(
      JSON.stringify({
        username: data.get("username"),
        password: data.get("password"),
      }),
    );
    fire("/auth/signup", {
      method: "post",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        username: data.get("username"),
        password: data.get("password"),
      }),
    });
  }
  console.log(data, error, isLoading);

  return (
    <div className="centered-section">
      <h1>sign up</h1>
      <Form isLoading={isLoading} method="post" onSubmit={handleSubmit}>
        {error && <p aria-live="polite">{error}</p>}
        <InputField label="username" required minLength="1" maxLength="30" />
        <InputField
          label="password"
          type="password"
          required
          minLength="1"
          maxLength="255"
        />
      </Form>
    </div>
  );
}
