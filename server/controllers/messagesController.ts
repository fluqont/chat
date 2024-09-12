import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";
import { encrypt, getMessages, Query } from "../services/messagesService.js";
import { getFriendshipStatus } from "./usersController.js";
import supabase from "../configs/supabase.js";

export async function messagesGet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const messages = await getMessages(req.query as Query);

    const { userId, partner: qPartner, partnerId } = req.query;

    const partner =
      qPartner === "true" &&
      (await prisma.user.findUnique({
        where: { id: Number(partnerId) },
      }));
    const friendshipStatus = partner
      ? await getFriendshipStatus(Number(userId), Number(partnerId))
      : null;
    const { publicUrl } = supabase.storage
      .from(String(req.query.partnerId))
      .getPublicUrl(String(partnerId)).data;

    const group =
      req.query.groupId &&
      (await prisma.group.findUnique({
        where: { id: Number(req.query.groupId) },
      }));
    res.json({
      messages: messages,
      partner: partner && {
        ...partner,
        friendshipStatus: friendshipStatus,
        pfpUrl: publicUrl,
      },
      group: group,
    });
  } catch (err) {
    next(err);
  }
}

export async function messagePost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { senderId, recipientId, groupId, text } = req.body;
  try {
    await prisma.message.create({
      data: {
        text: encrypt(text),
        senderId: Number(senderId),
        recipientId: Number(recipientId) || undefined,
        groupId: Number(groupId) || undefined,
      },
    });
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function messagePut(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { messageId } = req.params;
  const { text } = req.body;
  try {
    await prisma.message.update({
      data: {
        text: encrypt(text),
      },
      where: { id: Number(messageId) },
    });
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function messageDelete(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { messageId } = req.params;
  try {
    await prisma.message.delete({ where: { id: Number(messageId) } });
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}
