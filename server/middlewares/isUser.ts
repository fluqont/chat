import { NextFunction, Request, Response } from "express";
import { ErrorWithStatus } from "./errorHandler.js";

export async function isUser(req: Request, _: Response, next: NextFunction) {
  if (!req.user) {
    return next(new ErrorWithStatus("Unauthorized", 401));
  }

  next();
}
