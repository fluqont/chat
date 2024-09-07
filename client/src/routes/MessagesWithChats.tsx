import { useContext, useEffect, useState } from "react";
import Messages from "../components/Messages";
import useFetch from "../hooks/useFetch";
import classes from "./MessagesWtihChats.module.css";
import { UserContext } from "../context/UserContext";
import Chats from "../components/Chats";
import { useSearchParams } from "react-router-dom";

export default function MessagesWithChats() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: chats,
    fetchData: fetchChats,
    error: chatsError,
    isLoading: isChatsLoading,
  } = useFetch();

  const { user } = useContext(UserContext);

  const [messages, setMessages] = useState<Record<string, any>>({});
  console.log(typeof messages, messages);

  useEffect(() => {
    fetchChats(`/users/${user?.id ?? -1}`, { credentials: "include" });
  }, [user, messages]);

  const {
    data: messagesWithPartner,
    fetchData: fetchMessages,
    error: messagesError,
    isLoading: areMessagesLoading,
  } = useFetch();

  function messagesFetch(partnerId: string) {
    fetchMessages(
      `/messages?userId=${user?.id}&partnerId=${partnerId}&partner=true`,
    ).then((data) => setMessages(data));
  }

  const partnerId = searchParams.get("partner-id");
  useEffect(() => {
    if (user && partnerId) {
      messagesFetch(partnerId);
    } else {
      setMessages({});
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
      {!messagesWithPartner && areMessagesLoading && <p>loading...</p>}
      {messagesError && <p>{messagesError}</p>}
      {messages && messages.partner && (
        <Messages
          key={partnerId}
          partner={messagesWithPartner?.partner}
          messages={messagesWithPartner?.messages}
          fetchMessages={messagesFetch}
        />
      )}
    </section>
  );
}
