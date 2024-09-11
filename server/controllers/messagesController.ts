import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";
import { encrypt, getMessages, Query } from "../services/messagesService.js";
import { getFriendshipStatus } from "./usersController.js";

export async function messagesGet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const messages = await getMessages(req.query as Query);
    const partner =
      req.query.partner === "true" &&
      (await prisma.user.findUnique({
        where: { id: Number(req.query.partnerId) },
      }));
    const group =
      req.query.groupId &&
      (await prisma.group.findUnique({
        where: { id: Number(req.query.groupId) },
      }));
    const friendshipStatus = partner
      ? await getFriendshipStatus(
          Number(req.query.userId),
          Number(req.query.partnerId),
        )
      : null;
    res.json({
      messages: messages,
      partner: partner && { ...partner, friendshipStatus: friendshipStatus },
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
