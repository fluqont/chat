import { Link } from "react-router-dom";
import { User } from "../context/UserContext";

const Chats = ({ users }: { users: User[] }) => {
  return (
    <nav>
      {users.length > 0 ? (
        users.map((user) => (
          <Link key={user.id} to={`/?userId=${user.id}`}>
            {user.username}
          </Link>
        ))
      ) : (
        <p>no chats yet</p>
      )}
    </nav>
  );
};

export default Chats;
