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
    const isFriend =
      (await getFriendshipStatus(
        Number(req.query.userId),
        Number(req.query.partnerId),
      )) === "friend";
    const partner =
      req.query.partner === "true" &&
      (await prisma.user.findUnique({
        where: { id: Number(req.query.partnerId) },
      }));
    res.json({ messages: messages, partner: partner, isFriend: isFriend });
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
        recipientId: Number(recipientId),
        groupId: Number(groupId),
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
