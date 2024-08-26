import prisma from "../prisma/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function signupPost(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password must be provided." });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: "Username must be unique." });
    }

    const hashedPassword = await bcrypt.hash(username, 5);
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });
    res.json({ user });
    // ! TODO: send OK
  } catch (err) {
    next(err);
  }
}

export async function loginPost(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password must be provided." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(400).json({
        error: "Incorrect username.",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        error: "Incorrect password.",
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.json({ token: token });
  } catch (err) {
    next(err);
  }
}

export async function authGet(req, res, next) {}
