import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { User, UserContext } from "../context/UserContext";
import Form from "./Form";
import InputField from "./InputField";
import classes from "./Messages.module.css";
import useFetch from "../hooks/useFetch";
import { Edit, Trash } from "lucide-react";
import { getDate } from "../date";

interface Message {
  id: number;
  senderId: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

interface MessagesProps {
  partner: User;
  messages: Message[];
  fetchMessages: (partnerId: string) => void;
}

const Messages = ({ partner, messages, fetchMessages }: MessagesProps) => {
  const { fetchData, error, isLoading } = useFetch();

  const { user } = useContext(UserContext);

  const [edit, setEdit] = useState<false | number>(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    fetchData(
      edit ? `/messages/${edit}` : `/users/${user?.id}/messages/${partner.id}`,
      {
        method: edit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        credentials: "include",
        body: JSON.stringify({ text: data.get("message"), attachmentIds: [] }),
      },
    ).then(() => fetchMessages(String(partner.id)));
  }

  return (
    <section className={classes.messages}>
      <h2>{partner.username}</h2>
      {messages.length > 0 ? (
        messages.map((message) => (
          <Message
            message={message}
            partnerId={partner.id}
            setEdit={setEdit}
            key={message.id}
          />
        ))
      ) : (
        <p>no messages yet</p>
      )}
      <Form
        isLoading={isLoading}
        row={true}
        onSubmit={handleSubmit}
        style={{ marginTop: "2rem" }}
      >
        {error && <p aria-live="polite">{error}</p>}
        <InputField
          label="message"
          displayLabel={false}
          defaultValue={
            edit ? messages.find((message) => message.id === edit)?.text : ""
          }
        />
      </Form>
    </section>
  );
};

interface MessageProps {
  partnerId: number;
  message: Message;
  setEdit: Dispatch<SetStateAction<false | number>>;
}

const Message = ({ message, partnerId, setEdit }: MessageProps) => {
  const [deleted, setDeleted] = useState(false);

  const partnerMessage = message.senderId === partnerId;

  const createdAt = getDate(message.createdAt);
  const updatedAt = getDate(message.updatedAt);

  const { data, fetchData, error } = useFetch();
  function handleDeleteClick() {
    fetchData(`/messages/${message.id}`, {
      method: "DELETE",
      credentials: "include",
    });
  }

  useEffect(() => {
    if (data && data.message === "OK") {
      setDeleted(true);
    }
  }, [data]);

  if (deleted) return;

  return (
    <article
      key={message.id}
      className={[
        classes.message,
        classes[message.senderId === partnerId ? "partner" : "user"],
      ].join(" ")}
    >
      {error && <p aria-live="polite">{error}</p>}
      <div className={classes.header}>
        <p className={classes.text}>{message.text}</p>
        {!partnerMessage && (
          <nav className={classes.nav}>
            <button
              className="icon-button"
              aria-label="delete message"
              onClick={handleDeleteClick}
            >
              <Trash size={20} />
            </button>
            <button
              className="icon-button"
              aria-label="edit message"
              onClick={() => setEdit(message.id)}
            >
              <Edit size={20} />
            </button>
          </nav>
        )}
      </div>
      <p className={classes.time}>
        <time dateTime={message.createdAt}>{createdAt}</time>
      </p>
      {updatedAt !== createdAt && (
        <p className={classes.time}>
          edited at <time dateTime={message.updatedAt}>{updatedAt}</time>
        </p>
      )}
    </article>
  );
};

export default Messages;
