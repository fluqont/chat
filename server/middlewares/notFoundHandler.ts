import { NextFunction, Request, Response } from "express";
import { ErrorWithStatus } from "./errorHandler.js";

export default function notFoundHandler(
  _: Request,
  res: Response,
  __: NextFunction,
) {
  throw new ErrorWithStatus("Not found", 404);
}
