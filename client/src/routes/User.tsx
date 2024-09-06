import Form from "../components/Form";
import InputField from "../components/InputField";
import { UserContext } from "../context/UserContext";
import { FormEvent, useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

function User() {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const { data, fetchData, error, isLoading } = useFetch();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    fetchData(`/users/${user?.id}/username`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: data.get("username"),
      }),
    });
  }

  useEffect(() => {
    if (data && data.user) {
      setUser(data.user);
      navigate("/");
    }
  }, [data]);

  return (
    <section className="centered-section">
      <h1>Change user</h1>
      <Form onSubmit={handleSubmit} isLoading={isLoading}>
        {error && <p aria-live="polite">{error}</p>}
        <InputField label="username" defaultValue={user?.username} />
      </Form>
    </section>
  );
}

export default User;
