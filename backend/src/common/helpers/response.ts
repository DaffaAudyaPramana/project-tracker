import type { Response } from "express";
import type { ApiResponse } from "../types/api-response";

export function sendResponse<T>(res: Response, statusCode: number, message: string, data?: T) {
  const body: ApiResponse<T> = { success: true, message };

  if (data !== undefined) {
    body.data = data;
  }

  return res.status(statusCode).json(body);
}
