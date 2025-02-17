import Form from "../components/Form";
import InputField from "../components/InputField";
import { UserContext } from "../context/UserContext";
import { FormEvent, useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";

function EditGroup() {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const { user } = useContext(UserContext);

  const {
    data: group,
    fetchData: fetchGroup,
    error: groupError,
    isLoading: isGroupLoading,
  } = useFetch();
  useEffect(() => {
    if (user) {
      fetchGroup(`/groups/${groupId}`, { credentials: "include" });
    }
  }, [user]);

  const { data, fetchData, error, isLoading } = useFetch();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    fetchData(`/groups/${groupId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: data.get("name"),
      }),
      credentials: "include",
    });
  }

  useEffect(() => {
    if (data) {
      navigate(`/?group-id=${groupId}`);
    }
  }, [data]);

  const {
    fetchData: fetchUpload,
    isLoading: isUploading,
    error: uploadError,
  } = useFetch();

  function handleFileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (user) {
      const formData = new FormData(event.currentTarget);

      fetchUpload(`/users/${user.id}/profile-picture`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
    }
  }

  if (groupError) {
    return <p aria-live="polite">{groupError}</p>;
  }

  return (
    <>
      <section className="centered-section">
        <h2>Edit group</h2>
        {!group && isGroupLoading && (
          <p className="error-like-section">loading...</p>
        )}
        <Form
          onSubmit={handleFileSubmit}
          method="post"
          encType="multipart/form-data"
          isLoading={isUploading}
          row={true}
          style={{ marginBottom: "1rem" }}
        >
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
        <Form onSubmit={handleSubmit} isLoading={isLoading}>
          {error && <p aria-live="polite">{error}</p>}
          <InputField
            label="name"
            defaultValue={group?.name}
            required
            minLength={1}
            maxLength={30}
          />
        </Form>
      </section>
    </>
  );
}

export default EditGroup;
