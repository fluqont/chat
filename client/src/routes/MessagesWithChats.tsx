import { useContext, useEffect, useState } from "react";
import Messages from "../components/Messages";
import useFetch from "../hooks/useFetch";
import classes from "./MessagesWtihChats.module.css";
import { UserContext } from "../context/UserContext";
import Chats, { Chats as IChats } from "../components/Chats";
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

  useEffect(() => {
    if (user) {
      fetchChats(`/users/${user.id}/chats`, { credentials: "include" });
    }
  }, [user, messages]);

  const {
    data: messagesWithPartner,
    fetchData: fetchMessages,
    error: messagesError,
    isLoading: areMessagesLoading,
  } = useFetch();

  function messagesFetch(id: string, group: boolean) {
    fetchMessages(
      group
        ? `/messages?groupId=${id}`
        : `/messages?userId=${user?.id}&partnerId=${partnerId}&partner=true`,
      { credentials: "include" },
    ).then((data) => setMessages(data));
  }

  const partnerId = searchParams.get("partner-id");
  const groupId = searchParams.get("group-id");
  const id = partnerId ?? groupId;

  useEffect(() => {
    if (user && partnerId) {
      messagesFetch(partnerId, false);
    } else if (user && groupId) {
      messagesFetch(groupId, true);
    } else {
      setMessages({});
    }
  }, [user, searchParams]);

  if (!user) {
    return (
      <p className="error-like-section">You must log in to chat with people</p>
    );
  }

  return (
    <section className={classes.section}>
      {!chats && isChatsLoading && (
        <p className="error-like-section">loading...</p>
      )}
      {chatsError && <p className="error-like-section">{chatsError}</p>}
      {chats && (
        <Chats
          chats={chats as IChats}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      )}
      {!messagesWithPartner && areMessagesLoading && (
        <p className="error-like-section">loading...</p>
      )}
      {messagesError && <p className="error-like-section">{messagesError}</p>}
      {id && messages && messagesWithPartner && (
        <Messages
          key={id}
          partner={messagesWithPartner?.partner}
          messages={messagesWithPartner?.messages}
          group={messagesWithPartner?.group}
          fetchMessages={messagesFetch}
        />
      )}
      {!id && <p className="error-like-section">Select chat</p>}
    </section>
  );
}
