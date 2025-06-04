import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      res.status(400).json({
        error: "Validation failed",
        details: (err as any).errors.map((e: any) => e.message),
      });
    }
  };

export default validate;

/**
 * This module exports a middleware function for validating request bodies using Zod schemas.
 */
