import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";

export async function groupPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId, name } = req.body;
  try {
    const group = await prisma.group.create({
      data: {
        name: name,
        creatorId: Number(userId),
        members: { connect: { id: Number(userId) } },
      },
    });
    res.json({ group: group });
  } catch (err) {
    next(err);
  }
}

export async function groupGet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { groupId } = req.params;
  try {
    const group = await prisma.group.findUnique({
      where: { id: Number(groupId), members: { some: { id: req.user?.id } } },
    });
    res.json(group);
  } catch (err) {
    next(err);
  }
}

export async function groupPut(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { groupId } = req.params;
  const { name } = req.body;
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
