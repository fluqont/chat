import prisma from "../prisma/index.js";
import bcrypt from "bcryptjs";

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

export async function loginPost(req, res, next) {}

export async function authGet(req, res, next) {}
