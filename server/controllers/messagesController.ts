import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";
import { encrypt, getMessages, Query } from "../services/messagesService.js";

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
    res.json({ messages: messages, partner: partner });
  } catch (err) {
    next(err);
  }
}

// TODO: secure
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

// TODO: secure
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

// TODO: secure
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
