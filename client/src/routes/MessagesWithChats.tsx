import { useContext, useEffect } from "react";
import Messages from "../components/Messages";
import useFetch from "../hooks/useFetch";
import classes from "./MessagesWtihChats.module.css";
import { UserContext } from "../context/UserContext";
import Chats from "../components/Chats";
import { useSearchParams } from "react-router-dom";

export default function MessagesWithChats() {
  // get chats
  // display chats
  // on click get messages
  // display messages

  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: chats,
    fetchData: fetchChats,
    error: chatsError,
    isLoading: isChatsLoading,
  } = useFetch();

  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchChats(`/users/${user?.id}`, { credentials: "include" });
    }
  }, [user]);

  useEffect(() => {
    console.log(searchParams);
  }, [searchParams]);

  return (
    <section className={classes.section}>
      {!chats && isChatsLoading && <p>loading...</p>}
      {chatsError && <p>{chatsError}</p>}
      {chats && (
        <Chats
          users={chats.users}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      )}
      <Messages partner={{ id: 4, username: "sinskiy" }} messages={[]} />
    </section>
  );
}
