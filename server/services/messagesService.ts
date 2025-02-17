import prisma from "../configs/db.js";
import supabase from "../configs/supabase.js";

export function encrypt(text: string): string {
  return Buffer.from(text).toString("base64");
}

export function decrypt(text: string): string {
  return Buffer.from(text, "base64").toString();
}

export async function postMessage(
  text: string,
  senderId: string,
  recipientId?: string,
  groupId?: string,
) {
  const message = await prisma.message.create({
    data: {
      text: encrypt(text),
      senderId: Number(senderId),
      recipientId: Number(recipientId) || undefined,
      groupId: Number(groupId) || undefined,
    },
  });
  return message;
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
      OR: !groupId
        ? [
            {
              senderId: Number(userId) || undefined,
              recipientId: Number(partnerId) || undefined,
            },
            {
              senderId: Number(partnerId) || undefined,
              recipientId: Number(userId) || undefined,
            },
          ]
        : undefined,
      groupId: Number(groupId) || undefined,
    },
    orderBy: { createdAt: "asc" },
    take: Number(limit) || undefined,
    skip: Number(offset) || 0,
    include: { attachments: true },
  });
  const decryptedMessages = messages.map((message) => {
    const attachmentUrls = message.attachments.map(
      (attachment) =>
        supabase.storage
          .from(`${message.id}-message`)
          .getPublicUrl(attachment.fileName, {
            download: attachment.fileName,
          }).data.publicUrl,
    );
    return {
      ...message,
      text: decrypt(message.text),
      attachmentUrls: attachmentUrls,
    };
  });
  return decryptedMessages;
}
