import { FormEvent, useContext, useEffect } from "react";
import Form from "../components/Form";
import InputField from "../components/InputField";
import useFetch from "../hooks/useFetch";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const NewGroup = () => {
  const navigate = useNavigate();

  const { data, fetchData, error, isLoading } = useFetch();

  const { user } = useContext(UserContext);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    fetchData("/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        name: data.get("name"),
        userId: user?.id,
      }),
      credentials: "include",
    });
  }

  useEffect(() => {
    if (data) {
      navigate(`/groups/${data.group.id}/request`);
    }
  }, [data]);

  return (
    <section className="centered-section">
      <h1>New group</h1>
      <Form isLoading={isLoading} onSubmit={handleSubmit}>
        {error && <p aria-live="polite">{error}</p>}
        {isLoading && <p>loading...</p>}
        <InputField label="name" required minLength={1} maxLength={30} />
      </Form>
    </section>
  );
};

export default NewGroup;
