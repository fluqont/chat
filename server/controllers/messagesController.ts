import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";
import {
  encrypt,
  getMessages,
  postMessage,
  Query,
} from "../services/messagesService.js";
import { getFriendshipStatus } from "./usersController.js";
import supabase from "../configs/supabase.js";
import { ErrorWithStatus } from "../middlewares/errorHandler.js";
import { decode } from "base64-arraybuffer";
import { io } from "../app.js";

export async function messagesGet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const messages = await getMessages(req.query as Query);

    const { userId, partner: qPartner, partnerId, groupId } = req.query;

    const partner =
      qPartner === "true" &&
      (await prisma.user.findUnique({
        where: { id: Number(partnerId) },
      }));
    const friendshipStatus = partner
      ? await getFriendshipStatus(Number(userId), Number(partnerId))
      : null;

    const group =
      groupId &&
      (await prisma.group.findUnique({
        where: { id: Number(groupId) },
      }));

    const { publicUrl } = supabase.storage
      .from(groupId ? "groups-pfp" : "pfp")
      .getPublicUrl(
        groupId
          ? `${group && group.id}.${group && group.pfpFileExtension}`
          : `${partner && partner.id}.${partner && partner.pfpFileExtension}`,
      ).data;
    const response = await fetch(publicUrl);

    res.json({
      messages: messages,
      partner: partner && {
        ...partner,
        friendshipStatus: friendshipStatus,
        pfpUrl: response.ok
          ? publicUrl
          : process.env.CLIENT_URL + "/placeholder.svg",
      },
      group: group && {
        ...group,
        pfpUrl: response.ok ? publicUrl : undefined,
      },
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
    const message = await postMessage(text, senderId, recipientId, groupId);

    if (message.groupId) {
      io.to(`/groups/${message.groupId}`).emit("message", message);
    } else {
      io.to(`/users/${message.senderId}`).emit("message", message);
    }

    res.json({ message: message });
  } catch (err) {
    next(err);
  }
}

export async function attachmentsPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.files || !Array.isArray(req.files)) {
    return next(new ErrorWithStatus("File was not uploaded", 400));
  }

  const { messageId } = req.params;

  for (const { originalname, buffer } of req.files) {
    const fileBase64 = decode(buffer.toString("base64"));
    try {
      await prisma.attachment.create({
        data: { messageId: Number(messageId), fileName: originalname },
      });

      const bucket = `${messageId}-message`;

      const { data } = await supabase.storage.getBucket(String(bucket));
      if (!data) {
        const { error: bucketError } = await supabase.storage.createBucket(
          String(bucket),
          {
            public: true,
            fileSizeLimit: "1MB",
          },
        );
        if (bucketError) {
          return next(bucketError);
        }
      }

      const { error } = await supabase.storage
        .from(bucket)
        .upload(originalname, fileBase64, { upsert: true });
      if (error) {
        return next(error);
      }
    } catch (err) {
      next(err);
    }
  }

  res.json({ message: "OK" });
}

export async function messagePut(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { messageId } = req.params;
  const { text } = req.body;
  try {
    const message = await prisma.message.update({
      data: {
        text: encrypt(text),
      },
      where: { id: Number(messageId) },
    });

    if (message.groupId) {
      io.to(`/groups/${message.groupId}`).emit("message", message);
    } else {
      io.to(`/users/${message.senderId}`).emit("message", message);
    }

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
    const message = await prisma.message.delete({
      where: { id: Number(messageId) },
    });

    if (message.groupId) {
      io.to(`/groups/${message.groupId}`).emit("message", message);
    } else {
      io.to(`/users/${message.senderId}`).emit("message", message);
    }

    const bucket = `${messageId}-message`;

    await supabase.storage.emptyBucket(bucket);
    await supabase.storage.deleteBucket(bucket);

    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}
