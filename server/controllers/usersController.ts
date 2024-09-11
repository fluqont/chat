import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";
import { getMessages } from "../services/messagesService.js";

export async function userByUsernameGet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { username } = req.query;
  try {
    const user = await prisma.user.findUnique({
      where: { username: username as string },
    });
    const friendshipStatus = await getFriendshipStatus(
      Number(req.user?.id),
      Number(user?.id),
    );
    res.json({ user: user, friendshipStatus: friendshipStatus });
  } catch (err) {
    next(err);
  }
}
export async function getFriendshipStatus(
  currentUserId: number,
  searchedUserId: number,
): Promise<"friend" | "waits for your answer" | "request sent" | null> {
  if (isNaN(currentUserId) || isNaN(searchedUserId)) return null;

  const friendRequests = await prisma.friendRequest.findMany({
    where: {
      OR: [
        { userId: currentUserId, requestedUserId: searchedUserId },
        { userId: searchedUserId, requestedUserId: currentUserId },
      ],
    },
  });

  if (friendRequests.length === 2) {
    return "friend";
  } else if (friendRequests.length === 1) {
    if (friendRequests[0].userId === currentUserId) {
      return "request sent";
    } else {
      return "waits for your answer";
    }
  } else {
    return null;
  }
}

export async function chatsGet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params;
  try {
    const messages = await getMessages({ userId: userId });

    const userIds: number[] = [];
    const groupIds: number[] = [];

    for (const message of messages) {
      if (message.groupId) {
        groupIds.push(message.groupId);
      } else {
        userIds.push(message.senderId, message.recipientId!);
      }
    }

    const memberGroups = await prisma.group.findMany({
      where: {
        OR: [
          { creatorId: Number(userId) },
          { members: { some: { id: Number(userId) } } },
        ],
      },
      select: { id: true },
    });

    const uniqueUserIds = [...new Set(userIds)].filter(
      (id) => id !== Number(userId),
    );
    const uniqueGroupIds = [
      ...new Set(groupIds),
      ...memberGroups.map((group) => group.id),
    ];

    const users = await prisma.user.findMany({
      where: { id: { in: uniqueUserIds } },
    });
    const groups = await prisma.group.findMany({
      where: { id: { in: uniqueGroupIds } },
    });
    res.json({ users: users, groups: groups });
  } catch (err) {
    next(err);
  }
}

export async function friendsGet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params;
  const { groupRequests } = req.query;
  try {
    const friends = await prisma.user.findMany({
      where: {
        requests: { some: { requestedUserId: Number(userId) } },
        requested: { some: { userId: Number(userId) } },
      },
      include: { groupRequests: { where: { groupId: Number(groupRequests) } } },
    });
    res.json({ friends: friends });
  } catch (err) {
    next(err);
  }
}

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
