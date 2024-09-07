import { FormEvent, useContext } from "react";
import { User, UserContext } from "../context/UserContext";
import Form from "./Form";
import InputField from "./InputField";
import classes from "./Messages.module.css";
import useFetch from "../hooks/useFetch";

interface Message {
  id: number;
  senderId: number;
  text: string;
  createdAt: string;
}

interface MessagesProps {
  partner: User;
  messages: Message[];
  fetchMessages: (partnerId: string) => void;
}

const Messages = ({ partner, messages, fetchMessages }: MessagesProps) => {
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
    }).then(() => fetchMessages(String(partner.id)));
  }

  return (
    <section className={classes.messages}>
      <h2>{partner.username}</h2>
      {messages.length > 0 ? (
        messages.map((message) => (
          <Message message={message} partnerId={partner.id} key={message.id} />
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

interface MessageProps {
  partnerId: number;
  message: Message;
}

const Message = ({ message, partnerId }: MessageProps) => {
  const originalMessageDate = new Date(message.createdAt);
  const isToday =
    originalMessageDate.toDateString() === new Date().toDateString();

  const messageDate = isToday
    ? ""
    : originalMessageDate.toLocaleString([], { dateStyle: "medium" }) + ", ";

  const messageTime = originalMessageDate.toLocaleString([], {
    timeStyle: "short",
    hour12: false,
  });

  const fullMessageDate = `${messageDate}${messageTime}`;
  return (
    <article
      key={message.id}
      className={[
        classes.message,
        classes[message.senderId === partnerId ? "partner" : "user"],
      ].join(" ")}
    >
      <p className={classes.text}>{message.text}</p>
      <p className={classes.time}>
        <time dateTime={message.createdAt}>{fullMessageDate}</time>
      </p>
    </article>
  );
};

export default Messages;
