import { Link } from "react-router-dom";
import { User } from "../context/UserContext";

const Chats = ({ users }: { users: User[] }) => {
  return (
    <nav>
      {users.map((user) => (
        <Link key={user.id} to={`/?userId=${user.id}`}>
          {user.username}
        </Link>
      ))}
    </nav>
  );
};

export default Chats;
