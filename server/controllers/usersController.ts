import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";
import { getMessages } from "../services/messagesService.js";
import { decode } from "base64-arraybuffer";
import supabase from "../configs/supabase.js";
import { ErrorWithStatus } from "../middlewares/errorHandler.js";

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

    if (!user) {
      return next(new ErrorWithStatus("User not found", 404));
    }

    const friendshipStatus = await getFriendshipStatus(
      Number(req.user?.id),
      Number(user.id),
    );
    const { publicUrl } = supabase.storage
      .from("pfp")
      .getPublicUrl(`${user.id}.${user.pfpFileExtension}`).data;
    const response = await fetch(publicUrl);

    res.json({
      user: user,
      friendshipStatus: friendshipStatus,
      pfpUrl: response.ok
        ? publicUrl
        : process.env.CLIENT_URL + "/placeholder.svg",
    });
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
    const usersWithPfpUrls = users.map((user) => {
      if (user.pfpFileExtension) {
        const { publicUrl } = supabase.storage
          .from("pfp")
          .getPublicUrl(`${user.id}.${user.pfpFileExtension}`).data;
        return { ...user, pfpUrl: publicUrl };
      } else {
        return user;
      }
    });

    const groups = await prisma.group.findMany({
      where: { id: { in: uniqueGroupIds } },
    });
    const groupsWithPfpUrls = groups.map((group) => {
      if (group.pfpFileExtension) {
        const { publicUrl } = supabase.storage
          .from("groups-pfp")
          .getPublicUrl(`${group.id}.${group.pfpFileExtension}`).data;
        return { ...group, pfpUrl: publicUrl };
      } else {
        return group;
      }
    });

    res.json({ users: usersWithPfpUrls, groups: groupsWithPfpUrls });
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

export async function userProfilePicturePatch(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.file) {
    return next(new ErrorWithStatus("File was not uploaded", 400));
  }

  const { userId } = req.params;
  const { buffer, originalname, mimetype } = req.file;

  const fileExtension = originalname.split(".").at(-1);
  const fileBase64 = decode(buffer.toString("base64"));
  try {
    const { error } = await supabase.storage
      .from("pfp")
      .upload(`${userId}.${fileExtension}`, fileBase64, {
        upsert: true,
        contentType: mimetype,
      });
    if (error) {
      return next(error);
    }

    await prisma.user.update({
      where: { id: Number(userId) },
      data: { pfpFileExtension: fileExtension },
    });

    res.json({ message: "OK" });
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
    const user = await prisma.user.delete({ where: { id: Number(userId) } });
    const { error } = await supabase.storage
      .from("pfp")
      .remove([`${userId}.${user.pfpFileExtension}`]);
    if (error) {
      return next(error);
    }

    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}
