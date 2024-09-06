import { User } from "../context/UserContext";
import Form from "./Form";
import InputField from "./InputField";
import classes from "./Messages.module.css";

interface MessagesProps {
  partner: User;
  messages: Array<{
    id: number;
    author: "user" | "partner";
    text: string;
  }>;
}

const Messages = ({ partner, messages }: MessagesProps) => {
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
      <Form isLoading={false} row={true}>
        <InputField label="message" displayLabel={false} />
      </Form>
    </section>
  );
};
export default Messages;
