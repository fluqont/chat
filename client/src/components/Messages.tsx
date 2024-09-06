import { FormEvent, useContext } from "react";
import { User, UserContext } from "../context/UserContext";
import Form from "./Form";
import InputField from "./InputField";
import classes from "./Messages.module.css";
import useFetch from "../hooks/useFetch";

interface MessagesProps {
  partner: User;
  messages: Array<{
    id: number;
    author: "user" | "partner";
    text: string;
  }>;
}

const Messages = ({ partner, messages }: MessagesProps) => {
  const { fetchData, error, isLoading } = useFetch();

  const { user } = useContext(UserContext);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    fetchData(`/users/${user?.id}/messages/${partner.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      credentials: "include",
      body: JSON.stringify({ text: data.get("message"), attachmentIds: [] }),
    });
  }
  return (
    <section className={classes.messages}>
      <h2>{partner.username}</h2>
      {messages.length > 0 ? (
        messages.map((message) => (
          <article
            key={message.id}
            className={[classes.message, classes[message.author]].join(" ")}
          >
            {message.text}
          </article>
        ))
      ) : (
        <p>no messages yet</p>
      )}
      <Form isLoading={isLoading} row={true} onSubmit={handleSubmit}>
        {error && <p aria-live="polite">{error}</p>}
        <InputField label="message" displayLabel={false} />
      </Form>
    </section>
  );
};
export default Messages;
