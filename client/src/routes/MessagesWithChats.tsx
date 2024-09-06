import Messages from "../components/Messages";
import classes from "./MessagesWtihChats.module.css";

export default function MessagesWithChats() {
  // get chats
  // display chats
  // on click get messages
  // display messages

  return (
    <section className={classes.section}>
      <div>left</div>
      <Messages
        partner={{ id: 4, username: "sinskiy" }}
        messages={[
          { text: "hello, world!", author: "partner" },
          { text: "bye, world!", author: "partner" },
          { text: "hello, world!", author: "user" },
        ]}
      />
    </section>
  );
}
