import { Link, SetURLSearchParams } from "react-router-dom";
import { User } from "../context/UserContext";
import classes from "./Chats.module.css";
import { Plus } from "lucide-react";

interface ChatsProps {
  users: User[];
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

const Chats = ({ users, searchParams, setSearchParams }: ChatsProps) => {
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
        {users.length > 0 ? (
          users.map((user) => (
            <button
              key={user.id}
              onClick={() => setSearchParams({ "partner-id": String(user.id) })}
              className={[
                classes.chat,
                Number(searchParams.get("partner-id")) === user.id
                  ? "primary"
                  : "surface",
              ].join(" ")}
            >
              {user.username}
            </button>
          ))
        ) : (
          <p>no chats yet</p>
        )}
      </nav>
    </>
  );
};

export default Chats;
