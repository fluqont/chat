import { NextFunction, Request, Response } from "express";

export default function errorHandler(
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err.message, err.stack);

  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({ error: err.message });
}

export class ErrorWithStatus extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
