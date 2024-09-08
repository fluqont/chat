import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";

export async function groupRequestsGet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { groupId, userId } = req.query;
  try {
    const groupRequests = await prisma.groupRequest.findMany({
      where: { groupId: Number(groupId), userId: Number(userId) },
    });
    res.json({ groupRequests: groupRequests });
  } catch (err) {
    next(err);
  }
}

export async function groupRequestPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { groupId } = req.params;
  const { userId } = req.query;
  try {
    await prisma.groupRequest.create({
      data: {
        groupId: Number(groupId),
        userId: Number(userId),
      },
    });
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function groupRequestDelete(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { groupRequestId } = req.params;
  try {
    await prisma.groupRequest.delete({
      where: { id: Number(groupRequestId) },
    });
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}
