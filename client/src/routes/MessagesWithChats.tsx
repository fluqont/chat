import { useContext, useEffect, useState } from "react";
import Messages from "../components/Messages";
import useFetch from "../hooks/useFetch";
import classes from "./MessagesWtihChats.module.css";
import { UserContext } from "../context/UserContext";
import Chats from "../components/Chats";
import { useSearchParams } from "react-router-dom";

export default function MessagesWithChats() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<Record<string, any>>({});

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

  const {
    data: userWithMessages,
    fetchData: fetchMessages,
    error: messagesError,
    isLoading: areMessagesLoading,
  } = useFetch();

  useEffect(() => {
    const partnerId = searchParams.get("partner-id");
    if (user && partnerId) {
      fetchMessages(`/users/${user?.id}/messages/${partnerId}`).then((data) =>
        setMessages(data),
      );
    } else {
      setMessages([]);
    }
  }, [user, searchParams]);

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
      {!userWithMessages && areMessagesLoading && <p>loading...</p>}
      {messagesError && <p>{messagesError}</p>}
      {messages.user && messages.user.messages.length > 0 && (
        <Messages
          partner={userWithMessages?.user}
          messages={userWithMessages?.user.messages}
        />
      )}
    </section>
  );
}
