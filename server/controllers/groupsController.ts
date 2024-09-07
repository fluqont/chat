import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";

export async function groupPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { creatorId, name } = req.body;
  try {
    await prisma.group.create({
      data: { name: name, creatorId: Number(creatorId) },
    });
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function groupPut(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { groupId, name } = req.body;
  try {
    await prisma.group.update({
      data: { name: name },
      where: { id: Number(groupId) },
    });
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}

export async function groupDelete(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { groupId } = req.params;
  try {
    await prisma.group.delete({ where: { id: Number(groupId) } });
    res.json({ message: "OK" });
  } catch (err) {
    next(err);
  }
}
