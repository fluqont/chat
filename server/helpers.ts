import { Message } from "@prisma/client";

export const decryptMessages = (messages: Message[]) =>
  messages.map((message) => {
    return {
      ...message,
      text: Buffer.from(message.text, "base64").toString(),
    };
  });
