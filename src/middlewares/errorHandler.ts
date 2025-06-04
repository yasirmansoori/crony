import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(createError.NotFound("Requested route not found"));
};
interface ErrorHandlerError extends Error {
  status?: number;
}

const defaultErrorHandler = (
  err: ErrorHandlerError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message || "Internal Server Error",
    },
  });
};

export { notFoundMiddleware, defaultErrorHandler };

/**
 * Error handling middlewares for Express.js applications.
 */
