import { useContext, useEffect } from "react";
import Messages from "../components/Messages";
import useFetch from "../hooks/useFetch";
import classes from "./MessagesWtihChats.module.css";
import { UserContext } from "../context/UserContext";
import Chats from "../components/Chats";

export default function MessagesWithChats() {
  // get chats
  // display chats
  // on click get messages
  // display messages

  const { data, fetchData, error, isLoading } = useFetch();

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchData(`/users/${user?.id}`, { credentials: "include" });
    }
  }, [user]);

  return (
    <section className={classes.section}>
      {!data && isLoading && <p>loading...</p>}
      {error && <p>{error}</p>}
      {data && <Chats users={data.users} />}
      <Messages partner={{ id: 4, username: "sinskiy" }} messages={[]} />
    </section>
  );
}
