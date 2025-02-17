import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { User, UserContext } from "../context/UserContext";
import Form from "./Form";
import InputField from "./InputField";
import classes from "./Messages.module.css";
import useFetch from "../hooks/useFetch";
import { Edit, EditIcon, Paperclip, Send, Trash } from "lucide-react";
import { getDate } from "../date";
import { Group } from "./Chats";
import { useNavigate } from "react-router-dom";
import Pfp from "./Pfp";

interface Message {
  id: number;
  senderId: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  attachmentUrls: string[];
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
  const navigate = useNavigate();

  const { user, socket } = useContext(UserContext);

  const [edit, setEdit] = useState<false | number>(false);

  const isPartner = partner;
  const isFriend = isPartner ? partner.friendshipStatus === "friend" : false;
  const [status, setStatus] = useState(isFriend ? "OFFLINE" : null);

  useEffect(() => {
    if (partner) {
      setStatus(partner.status);
    }
  }, [partner?.status]);

  useEffect(() => {
    if (socket) {
      if (isPartner) {
        socket.emit("/users", partner.id);
      } else {
        socket.emit("/groups", group!.id);
      }

      if (isPartner) {
        socket.on("status", (status) => setStatus(status));
        socket.on("message", () => {
          fetchMessages(String(partner.id), false);
        });
      } else {
        socket.on("message", () => fetchMessages(String(group!.id), true));
      }
    }
  }, [socket]);

  const {
    data,
    fetchData: fetchGroupDelete,
    error: groupDeleteError,
  } = useFetch();

  function handleGroupDelete() {
    fetchGroupDelete(`/groups/${group?.id}`, {
      method: "DELETE",
      credentials: "include",
    });
  }

  useEffect(() => {
    if (data?.message === "OK") {
      navigate("/");
    }
  }, [data]);

  return (
    <section className={classes.messages}>
      <header className={classes.header}>
        <div className={classes.right}>
          <Pfp url={partner ? partner.pfpUrl : group!.pfpUrl} />
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
        </div>
        {group && group.creatorId === user?.id && (
          <nav className={classes.groupNav}>
            <button
              className="icon-button"
              aria-label="edit group"
              onClick={() => navigate(`/groups/${group.id}/edit`)}
            >
              <EditIcon size={20} />
            </button>
            <button
              className="icon-button"
              aria-label="delete group"
              onClick={handleGroupDelete}
            >
              <Trash size={20} />
            </button>
          </nav>
        )}
      </header>
      {groupDeleteError && <p aria-live="polite">{groupDeleteError}</p>}
      {messages.length > 0 ? (
        messages.map((message) => (
          <Message message={message} setEdit={setEdit} key={message.id} />
        ))
      ) : (
        <p>no messages yet</p>
      )}
      <NewMessage
        fetchMessages={fetchMessages}
        edit={edit}
        group={group}
        isPartner={isPartner}
        messages={messages}
        partner={partner}
        setEdit={setEdit}
      />
    </section>
  );
};

interface NewMessageProps {
  fetchMessages: (id: string, group: boolean) => void;
  edit: false | number;
  setEdit: Dispatch<SetStateAction<NewMessageProps["edit"]>>;
  isPartner: User | undefined;
  partner?: User;
  group?: Group;
  messages: Message[];
}

const NewMessage = ({
  fetchMessages,
  edit,
  setEdit,
  isPartner,
  partner,
  group,
  messages,
}: NewMessageProps) => {
  const [files, setFiles] = useState<FileList | null>(null);

  const { data, fetchData, error } = useFetch();

  const { user } = useContext(UserContext);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    fetchData(edit ? `/messages/${edit}` : `/messages`, {
      method: edit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        text: data.get("message"),
        senderId: user?.id,
        recipientId: isPartner ? partner!.id : null,
        groupId: !isPartner ? group!.id : null,
      }),
      credentials: "include",
    });

    setEdit(false);
    setFiles(null);
  }

  const { fetchData: fetchAttachments, isLoading } = useFetch();

  useEffect(() => {
    if (data) {
      const attachments = inputRef.current?.files;
      if (attachments && attachments.length > 0) {
        const formData = new FormData();
        Array.from(attachments).forEach((file, index) => {
          formData.append(`file${index}`, file);
        });
        fetchAttachments(`/messages/${data.message.id}/attachments`, {
          method: "POST",
          body: formData,
          credentials: "include",
        }).then(() => {
          fetchMessageByPartner();
        });
      } else {
        fetchMessageByPartner();
      }
    }
  }, [data]);

  function fetchMessageByPartner() {
    isPartner
      ? fetchMessages(String(partner!.id), false)
      : fetchMessages(String(group!.id), true);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;
    if (files) {
      setFiles(files);
    }
  }

  function clearInput() {
    if (inputRef.current) {
      inputRef.current.value = "";
      setFiles(null);
    }
  }
  return (
    <div style={{ marginTop: "2rem" }}>
      {files && (
        <button onClick={clearInput} className="surface">
          delete attachments
        </button>
      )}
      {files && (
        <ul role="list" style={{ margin: "1rem 0" }}>
          {Array.from(files).map((file) => (
            <p key={file.lastModified}>{file.name}</p>
          ))}
        </ul>
      )}
      <Form
        isLoading={isLoading}
        row={true}
        onSubmit={handleSubmit}
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ position: "relative", paddingRight: "1rem" }}>
            <Paperclip />
            <InputField
              onChange={handleChange}
              label="attachments"
              type="file"
              displayLabel={false}
              style={{ position: "absolute", inset: 0, opacity: 0 }}
              multiple
              ref={inputRef}
            />
          </div>
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
        </div>
      </Form>
    </div>
  );
};

interface MessageProps {
  message: Message;
  setEdit: Dispatch<SetStateAction<false | number>>;
}

const Message = ({ message, setEdit }: MessageProps) => {
  const [deleted, setDeleted] = useState(false);

  const { user } = useContext(UserContext);

  const ownMessage = message.senderId === user?.id;

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
        classes[ownMessage ? "user" : "partner"],
      ].join(" ")}
    >
      {error && <p aria-live="polite">{error}</p>}
      <div className={classes.header}>
        <p className={classes.text}>{message.text}</p>
        {ownMessage && (
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
      {message.attachmentUrls.length > 0 && (
        <ul role="list">
          {message.attachmentUrls.map((url, i) => (
            <li key={url}>
              {url.endsWith(".png") ||
              url.endsWith(".webp") ||
              url.endsWith(".jpg") ||
              url.endsWith(".jpeg") ? (
                <img
                  src={url.split("?download=")[0]}
                  alt={`attachment ${i}`}
                  width={200}
                  height={50}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <a href={url}>attachment {i}</a>
              )}
            </li>
          ))}
        </ul>
      )}
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
