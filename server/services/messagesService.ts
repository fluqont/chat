import prisma from "../configs/db.js";

export function encrypt(text: string): string {
  return Buffer.from(text).toString("base64");
}

export function decrypt(text: string): string {
  return Buffer.from(text, "base64").toString();
}

export type Query = Record<string, string | null>;
export async function getMessages({
  userId,
  partnerId,
  groupId,
  limit,
  offset,
}: Query) {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: Number(userId),
          recipientId: Number(partnerId) || undefined,
        },
        {
          senderId: Number(partnerId) || undefined,
          recipientId: Number(userId),
        },
      ],
      groupId: Number(groupId) || undefined,
    },
    orderBy: { createdAt: "asc" },
    take: Number(limit) || undefined,
    skip: Number(offset) || 0,
  });
  const decryptedMessages = messages.map((message) => {
    return { ...message, text: decrypt(message.text) };
  });
  return decryptedMessages;
}
