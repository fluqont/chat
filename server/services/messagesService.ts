import prisma from "../configs/db.js";
import supabase from "../configs/supabase.js";

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
          .getPublicUrl(String(attachment.id), { download: true }).data
          .publicUrl,
    );
    return {
      ...message,
      text: decrypt(message.text),
      attachmentUrls: attachmentUrls,
    };
  });
  return decryptedMessages;
}
