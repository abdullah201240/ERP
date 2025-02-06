import { Request, Response, NextFunction } from "express";
import { ApiError, formatErrorResponse, logError } from "../utils/root";
import logger from "../logger/winstonLogger"; // Import your custom Winston logger

export const errorMiddleware = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;

  
  // Log the error
  logError(error);

  // Log the error using the custom Winston logger
  logger.error(`Error: ${error.message}`, { error });

  // Send the formatted error response
  res.status(statusCode).json(formatErrorResponse(error));
};