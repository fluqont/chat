import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";
import { StatusType } from "@prisma/client";
import { decryptMessages } from "../helpers.js";

export async function userByUsernameGet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { username } = req.query;
  try {
    const user = await prisma.user.findUnique({
      where: { username: username as string },
      include: req.user && {
        requests: {
          where: { requestedUserId: req.user.id },
          include: { user: true },
        },
        requested: { where: { userId: req.user.id }, include: { user: true } },
      },
    });
    res.json({ user: user });
  } catch (err) {
    next(err);
  }
}

export async function userGet(req: Request, res: Response, next: NextFunction) {
  const { userId, partnerId } = req.params;
  try {
    const relatedFriendRequests = await prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            AND: [
              { userId: Number(userId) },
              { requestedUserId: Number(partnerId) },
            ],
          },
          {
            AND: [
              { requestedUserId: Number(userId) },
              { userId: Number(partnerId) },
            ],
          },
        ],
      },
    });

    if (relatedFriendRequests.length === 2) {
      return next();
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: Number(partnerId) },
      include: { messages: true, gottenMessages: true },
    });

    const decryptedSortedMessages = decryptMessages([
      ...user.messages,
      ...user.gottenMessages,
    ]).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    res.json({
      user: {
        ...user,
        messages: decryptedSortedMessages,
        gottenMessages: undefined,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function chatsGet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params;
  try {
    const users = await prisma.user.findMany({
      where: {
        messages: {
          some: {
            OR: [{ senderId: Number(userId) }, { recipientId: Number(userId) }],
          },
        },
        id: {
          not: Number(userId),
        },
      },
      distinct: "username",
    });
    res.json({ users: users });
  } catch (err) {
    next(err);
  }
}

export async function friendGet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { partnerId } = req.params;
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: Number(partnerId) },
      include: { status: true, gottenMessages: true, messages: true },
    });

    const decryptedSortedMessages = decryptMessages([
      ...user.messages,
      ...user.gottenMessages,
    ]).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    console.log(decryptedSortedMessages, user.gottenMessages, user.messages);

    res.json({ user: { ...user, messages: decryptedSortedMessages } });
  } catch (err) {
    next(err);
  }
}

// TODO: secure
export async function userStatusPatch(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params;
  const { status } = req.body;
  try {
    await prisma.user.update({
      data: { status: { update: { type: status as StatusType } } },
      where: { id: Number(userId) },
    });
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}

// TODO: secure
export async function userUsernamePatch(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params;
  const { username } = req.body;
  try {
    const user = await prisma.user.update({
      data: { username: username as string },
      where: { id: Number(userId) },
    });
    res.json({ user: user });
  } catch (err) {
    next(err);
  }
}

// TODO: secure
export async function userDelete(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params;
  try {
    await prisma.user.delete({ where: { id: Number(userId) } });
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}
