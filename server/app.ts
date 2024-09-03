import "dotenv/config";
import express, { json, Request, Response, urlencoded } from "express";
import cors from "cors";
import session from "express-session";
import apiRouter from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import prisma from "./configs/db.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import passportLocal from "passport-local";

const app = express();
app.use(cors<Request>());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 2 },
  }),
);
const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
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
  if ("id" in user) {
    return done(null, user.id);
  }

  done(new Error("No id in user"));
});

passport.deserializeUser(async (userId: number, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

app.use(passport.session());

app.use("/api", apiRouter);

app.use("*", (req: Request, res: Response) => console.log("what????", req.url));

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(
  port,
  () =>
    process.env.NODE_ENV === "development" &&
    console.log("http://localhost:" + port),
);
