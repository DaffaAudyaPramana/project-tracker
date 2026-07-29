import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export const validate = (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return next(result.error);
  }

  req.body = result.data;
  return next();
};

export const validateQuery =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return next(result.error);
    }

    // In Express 5, req.query is exposed through a getter and cannot be
    // reassigned. Keep the parsed, validated query in res.locals instead.
    res.locals.validatedQuery = result.data;
    return next();
  };
