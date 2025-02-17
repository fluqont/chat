import { FormEvent, useContext, useEffect, useState } from "react";
import Form from "../components/Form";
import InputField from "../components/InputField";
import useFetch from "../hooks/useFetch";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

const NewGroup = () => {
  const navigate = useNavigate();

  const [screen, setScreen] = useState<0 | 1>(0);

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
      setScreen(1);
    }
  }, [data]);

  const {
    data: uploadData,
    fetchData: fetchUpload,
    isLoading: isUploading,
    error: uploadError,
  } = useFetch();

  function handleFileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (data && user) {
      const formData = new FormData(event.currentTarget);

      fetchUpload(`/groups/${data.group.id}/profile-picture`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
    }
  }

  useEffect(() => {
    if (data && uploadData) {
      navigate(`/groups/${data.group.id}/request`);
    }
  }, [uploadData]);

  if (error) {
    return <p aria-live="polite">{error}</p>;
  }

  return (
    <section className="centered-section">
      <h1>New group</h1>
      {!data && isLoading && <p className="error-like-section">loading...</p>}
      {screen === 0 && (
        <Form isLoading={isLoading} onSubmit={handleSubmit}>
          {error && <p aria-live="polite">{error}</p>}
          {isLoading && <p>loading...</p>}
          <InputField label="name" required minLength={1} maxLength={30} />
        </Form>
      )}
      {screen === 1 && (
        <Form
          onSubmit={handleFileSubmit}
          method="post"
          encType="multipart/form-data"
          isLoading={isUploading}
          row={true}
          style={{ marginBottom: "1rem" }}
        >
          <Link to={`/groups/${data?.group.id}/request`}>skip</Link>
          <small>limit is 1mb</small>
          {uploadError && <p aria-live="polite">{uploadError}</p>}
          <InputField
            label="Profile picture"
            id="profile-picture"
            type="file"
            accept="image/*"
            required
          />
        </Form>
      )}
    </section>
  );
};

export default NewGroup;
