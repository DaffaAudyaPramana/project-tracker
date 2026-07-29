import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = req.header("x-request-id") ?? randomUUID();
  const startedAt = performance.now();
  res.setHeader("x-request-id", requestId);

  res.on("finish", () => {
    console.info(
      JSON.stringify({
        level: "info",
        requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Math.round(performance.now() - startedAt),
      }),
    );
  });

  next();
}
