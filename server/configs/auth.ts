import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./db.js";
import passportLocal from "passport-local";
import passport from "passport";
import bcrypt from "bcryptjs";

export const prismaStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000,
});

const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username: username },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      done(null, user);
    } catch (err) {
      done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
