import { NextFunction, Request, Response } from "express";
import prisma from "../configs/db.js";
import { ErrorWithStatus } from "../middlewares/errorHandler.js";
import supabase from "../configs/supabase.js";

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

    // if (!group) {
    //   return next(new ErrorWithStatus("Group not found", 404));
    // }

    // const { publicUrl } = supabase.storage
    //   .from("groups-pfp")
    //   .getPublicUrl(`${group.id}.${group.pfpFileExtension}`).data;
    // const response = await fetch(publicUrl);

    // res.json({
    //   ...group,
    //   pfpUrl: response.ok
    //     ? publicUrl
    //     : process.env.CLIENT_URL + "/placeholder.svg",
    // });
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

export async function groupProfilePicturePatch(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.file) {
    return next(new ErrorWithStatus("File was not uploaded", 400));
  }

  const { groupId } = req.params;
  const { buffer, originalname, mimetype } = req.file;

  const fileExtension = originalname.split(".").at(-1);
  try {
    const { error } = await supabase.storage
      .from("groups-pfp")
      .upload(`${groupId}.${fileExtension}`, buffer, {
        upsert: true,
        contentType: mimetype,
      });
    if (error) {
      return next(error);
    }

    await prisma.group.update({
      where: { id: Number(groupId) },
      data: { pfpFileExtension: fileExtension },
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
