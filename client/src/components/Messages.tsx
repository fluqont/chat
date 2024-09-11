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
import { Edit, Send, Trash } from "lucide-react";
import { getDate } from "../date";
import { Group } from "./Chats";

interface Message {
  id: number;
  senderId: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

interface MessagesProps {
  partner?: User;
  group?: Group;
  messages: Message[];
  fetchMessages: (id: string, group: boolean) => void;
}

const Messages = ({
  partner,
  group,
  messages,
  fetchMessages,
}: MessagesProps) => {
  const { fetchData, error, isLoading } = useFetch();

  const { user } = useContext(UserContext);

  const [edit, setEdit] = useState<false | number>(false);

  const isPartner = partner;
  const isFriend = isPartner ? partner.friendshipStatus === "friend" : false;
  const [status, setStatus] = useState(isFriend ? "OFFLINE" : null);

  const [ws, setWs] = useState<null | WebSocket>(null);
  useEffect(() => {
    if (user) {
      const ws = new WebSocket(
        `${import.meta.env.VITE_WS_URL}?userId=${user.id}&${partner ? "partnerId=" + partner.id : "groupId" + group!.id}`,
      );
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "get-status" }));
      };

      ws.onmessage = async ({ data }) => {
        switch (data) {
          case "message": {
            setTimeout(() => {
              if (isPartner) {
                fetchMessages(String(partner.id), false);
              } else {
                fetchMessages(String(group!.id), true);
              }
            }, 1000);
            break;
          }
          default: {
            if (!isFriend) return;

            setStatus(data);
            break;
          }
        }
      };

      setWs(ws);

      return () => ws.close();
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    fetchData(edit ? `/messages/${edit}` : `/messages`, {
      method: edit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: data.get("message"),
        attachmentIds: [],
        senderId: user?.id,
        recipientId: isPartner ? partner.id : null,
        groupId: !isPartner ? group!.id : null,
      }),
      credentials: "include",
    }).then(() =>
      isPartner
        ? fetchMessages(String(partner.id), false)
        : fetchMessages(String(group!.id), true),
    );

    setEdit(false);

    ws && ws.send(JSON.stringify({ type: "message" }));
  }

  return (
    <section className={classes.messages}>
      <h2>
        <span>{isPartner ? partner.username : group!.name}</span>
        <small
          className={[
            classes.status,
            status && classes[status.toLowerCase()],
          ].join(" ")}
        >
          {status && !group && status}
        </small>
      </h2>
      {messages.length > 0 ? (
        messages.map((message) => (
          <Message
            message={message}
            partnerId={isPartner ? partner.id : -1}
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
        submitProps={{
          children: <Send size={20} />,
          style: {
            padding: "0",
            height: "3rem",
            width: "3rem",
          },
          "aria-label": "send",
        }}
      >
        {error && <p aria-live="polite">{error}</p>}
        <InputField
          key={messages.length}
          label="message"
          displayLabel={false}
          defaultValue={
            edit ? messages.find((message) => message.id === edit)?.text : ""
          }
          required
          minLength={1}
          maxLength={255}
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
