import "dotenv/config";
import express, { json, urlencoded } from "express";
import cors from "cors";
import router from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/api", router);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`http://localhost:${process.env.PORT}`);
  }
});
