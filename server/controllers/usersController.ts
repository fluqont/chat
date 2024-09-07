import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";
import { StatusType } from "@prisma/client";
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
async function getFriendshipStatus(
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

// export async function userGet(req: Request, res: Response, next: NextFunction) {
//   const { userId, partnerId } = req.params;
//   try {
//     const friendshipStatus = getFriendshipStatus(Number(userId), Number(partnerId))

//     if (relatedFriendRequests.length === 2) {
//       return next();
//     }

//     const user = await prisma.user.findUniqueOrThrow({
//       where: { id: Number(partnerId) },
//       include: {
//         messages: {
//           where: { senderId: Number(partnerId), recipientId: Number(userId) },
//         },
//         gottenMessages: {
//           where: { senderId: Number(userId), recipientId: Number(partnerId) },
//         },
//       },
//     });

//     const decryptedSortedMessages = decryptMessages([
//       ...user.messages,
//       ...user.gottenMessages,
//     ]).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

//     res.json({
//       user: {
//         ...user,
//         messages: decryptedSortedMessages,
//         gottenMessages: undefined,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// }

export async function chatsGet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req.params;
  try {
    // const gotters = await prisma.user.findMany({
    //   where: {
    //     messages: {
    //       some: { recipientId: Number(userId) },
    //     },
    //     id: {
    //       not: Number(userId),
    //     },
    //   },
    //   distinct: "username",
    // });

    // const senders = await prisma.user.findMany({
    //   where: {
    //     gottenMessages: {
    //       some: { senderId: Number(userId) },
    //     },
    //     id: {
    //       not: Number(userId),
    //     },
    //   },
    //   distinct: "username",
    // });

    // deduplicate users
    // const userIds: Record<number, boolean> = {};
    // res.json({
    //   users: [...gotters, ...senders].filter((user) => {
    //     const seenBefore = userIds[user.id];
    //     userIds[user.id] = true;
    //     return !seenBefore;
    //   }),
    // });

    const messages = await getMessages({ userId: userId });
    const userIds = messages
      .flatMap((message) => [message.senderId, message.recipientId])
      .filter((id) => id && id !== Number(userId)) as number[];
    const uniqueUserIds = [...new Set(userIds)];
    const users = await prisma.user.findMany({
      where: { id: { in: uniqueUserIds } },
    });
    res.json({ users: users });
  } catch (err) {
    next(err);
  }
}

// export async function friendGet(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   const { partnerId } = req.params;
//   try {
//     const user = await prisma.user.findUniqueOrThrow({
//       where: { id: Number(partnerId) },
//       include: { status: true, gottenMessages: true, messages: true },
//     });

//     const decryptedSortedMessages = decryptMessages([
//       ...user.messages,
//       ...user.gottenMessages,
//     ]).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

//     res.json({ user: { ...user, messages: decryptedSortedMessages } });
//   } catch (err) {
//     next(err);
//   }
// }

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
