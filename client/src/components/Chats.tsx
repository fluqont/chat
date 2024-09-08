import { Link, SetURLSearchParams } from "react-router-dom";
import { User } from "../context/UserContext";
import classes from "./Chats.module.css";
import { Plus } from "lucide-react";

interface Group {
  id: number;
  name: string;
}

export interface Chats {
  users: User[];
  groups: Group[];
}

interface ChatsProps {
  chats: Chats;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

const Chats = ({ chats, searchParams, setSearchParams }: ChatsProps) => {
  return (
    <>
      <nav className={classes.chats}>
        <Link
          to="/new-group"
          className={[classes.chat, classes.group, "primary link-button"].join(
            " ",
          )}
        >
          <Plus size={20} />
          new group
        </Link>
        {chats.users.length > 0 ? (
          chats.users.map((user) => (
            <Chat
              key={user.id}
              id={user.id}
              label={user.username}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          ))
        ) : (
          <p>no chats yet</p>
        )}
        {chats.groups.length > 0 && (
          <>
            <h3 style={{ marginTop: "2rem", textAlign: "center" }}>Groups</h3>
            {chats.groups.map((group) => (
              <Chat
                key={group.id}
                id={group.id}
                label={group.name}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            ))}
          </>
        )}
      </nav>
    </>
  );
};

interface Chat {
  id: number;
  label: string;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

const Chat = ({ id, label, searchParams, setSearchParams }: Chat) => {
  return (
    <button
      onClick={() => setSearchParams({ "partner-id": String(id) })}
      className={[
        classes.chat,
        Number(searchParams.get("partner-id")) === id ? "primary" : "surface",
      ].join(" ")}
    >
      {label}
    </button>
  );
};

export default Chats;
