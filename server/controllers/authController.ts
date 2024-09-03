import prisma from "../configs/db.js";
import bcrypt from "bcryptjs";
import { ErrorWithStatus } from "../middlewares/errorHandler.js";
import { NextFunction, Request, Response } from "express";

export async function signupPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { username, password } = req.body;

  try {
    const userExists = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (userExists) {
      return next(new ErrorWithStatus("Username is not unique", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const user = await prisma.user.create({
      data: { username: username, password: hashedPassword },
    });
    res.json({ user: user });
  } catch (err) {
    next(err);
  }
}

export function logoutGet(req: Request, res: Response, next: NextFunction) {
  req.logout((err) => {
    if (err) {
      return next(new ErrorWithStatus("Log out error", 500));
    }
  });
  res.json({ message: "OK" });
}

export async function authGet(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (!user) {
    return next(new ErrorWithStatus("Authorization error", 401));
  }

  res.json({ user: user });
}
