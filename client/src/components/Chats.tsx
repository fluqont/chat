import { Link, SetURLSearchParams } from "react-router-dom";
import { User } from "../context/UserContext";
import classes from "./Chats.module.css";
import { Menu, Plus, X } from "lucide-react";
import { useState } from "react";

export interface Group {
  id: number;
  creatorId: number;
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
  const [checked, setChecked] = useState(false);
  return (
    <div className={classes.wrapper}>
      <label htmlFor="menu" className={classes.menuLabel}>
        menu
      </label>
      <div className={classes.icon}>{checked ? <X /> : <Menu />}</div>
      <input
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        type="checkbox"
        name="menu"
        id="menu"
        className={classes.menu}
      />
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
              searchParam="partner-id"
              pfpUrl={user.pfpUrl}
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
                searchParam="group-id"
              />
            ))}
          </>
        )}
      </nav>
    </div>
  );
};

interface Chat {
  id: number;
  label: string;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  searchParam: string;
  pfpUrl?: string;
}

const Chat = ({
  id,
  label,
  searchParams,
  setSearchParams,
  searchParam,
  pfpUrl,
}: Chat) => {
  return (
    <button
      onClick={() => setSearchParams({ [searchParam]: String(id) })}
      className={[
        classes.chat,
        Number(searchParams.get(searchParam)) === id
          ? "primary"
          : "surface-high",
      ].join(" ")}
    >
      {pfpUrl && (
        <img
          src={pfpUrl}
          width={24}
          height={24}
          className={classes.pfp}
          alt="user's profile picture"
        />
      )}
      {label}
    </button>
  );
};

export default Chats;
