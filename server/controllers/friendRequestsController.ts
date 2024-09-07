import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";

export async function friendRequestsGet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId, requestedUserId } = req.query;
  try {
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        userId: Number(userId),
        requestedUserId: Number(requestedUserId),
      },
    });
    res.json({ friendRequests: friendRequests });
  } catch (err) {
    next(err);
  }
}

export async function friendRequestPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId, requestedUserId } = req.body;
  try {
    await prisma.friendRequest.create({
      data: {
        userId: Number(userId),
        requestedUserId: Number(requestedUserId),
      },
    });
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function friendRequestDelete(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { friendRequestId } = req.params;
  try {
    await prisma.friendRequest.delete({
      where: { id: Number(friendRequestId) },
    });
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}
