import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";

// TODO: secure
export async function messagePost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId, partnerId } = req.params;
  const { text, attachmentIds } = req.body;

  const attachments = (attachmentIds as string[]).map((attachment) => {
    return { id: Number(attachment) };
  });

  try {
    await prisma.message.create({
      data: {
        text: Buffer.from(text).toString("base64"),
        senderId: Number(userId),
        recipientId: Number(partnerId),
        attachments: {
          createMany: {
            data: attachments,
          },
        },
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
        text: Buffer.from(text).toString("base64"),
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
    await prisma.user.delete({ where: { id: Number(messageId) } });
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}
