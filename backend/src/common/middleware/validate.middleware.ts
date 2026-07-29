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

    res.locals.validatedQuery = result.data;
    return next();
  };
