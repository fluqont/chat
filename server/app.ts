import "dotenv/config";
import express, { json, Request, urlencoded } from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
const app = express();
app.use(cors<Request>());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(
  port,
  () =>
    process.env.NODE_ENV === "development" &&
    console.log("http://localhost:" + port),
);
