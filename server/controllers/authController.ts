import prisma from "../configs/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
      data: {
        username: username,
        password: hashedPassword,
      },
    });
    res.json({ user: user });
  } catch (err) {
    next(err);
  }
}

export async function loginPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      return next(new ErrorWithStatus("Incorrect username", 400));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(new ErrorWithStatus("Incorrect password", 400));
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.SECRET,
      {
        expiresIn: "24h",
      },
    );
    res.json({ token: token });
  } catch (err) {
    next(err);
  }
}

export async function authGet(req: Request, res: Response, next: NextFunction) {
  try {
    const bearerHeader = req.header("Authorization");
    // ignore ts because we will catch an error anyway
    const token = bearerHeader!.split(" ")[1];

    const user = jwt.verify(token, process.env.SECRET);

    res.locals.user = user;
    res.json({ user: user });
  } catch (err: any) {
    err.statusCode = 401;
    next(err);
  }
}
