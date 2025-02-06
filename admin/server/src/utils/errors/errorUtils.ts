import { ApiError } from "./ApiError";
import { ApiResponse } from "./ApiResponse";
import { NextFunction, Request, Response } from "express";
import logger from "../../logger/winstonLogger"; // Use your custom Winston logger

/**
 * Formats an error into a consistent JSON response.
 * @param error - The error object (ApiError)
 */
export function formatErrorResponse(error: ApiError) {
  return {
    ...ApiResponse.error({
      name: error.name,
      userMessage: error.userMessage || "An error occurred.",
      errorCode: error.errorCode,
      statusCode: error.statusCode,
      message: error.message,
    }),
    timestamp: new Date().toISOString(),
  };
}


/**
 * Middleware-safe wrapper for async controllers.
 * Ensures that any async controller errors are passed to the next middleware.
 * @param fn - The async function to wrap
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction): Promise<any> =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Logs detailed error information using Winston logger.
 * @param error - The error object
 */
export function logError(error: ApiError | any) {
  if (error instanceof ApiError) {
    // Log ApiError details
    logger.error({
      timestamp: new Date().toISOString(),
      name: error.name,
      message: error.message,
      stack: error.stack,
      metadata: error.metadata,
      statusCode: error.statusCode,
      errorCode: error.errorCode,
    });
  } else {
    // Log unexpected errors
    logger.error({
      timestamp: new Date().toISOString(),
      name: "UnexpectedError",
      message: error.message || "No message available",
      stack: error.stack || "No stack trace available",
    });
  }
}

/**
 * Global error handler middleware.
 * Handles both ApiError instances and unexpected errors.
 * @param err - The error object
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 */
export function handleUnexpectedError(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    // Format and send ApiError response
    logError(err); // Log the error
    const errorResponse = formatErrorResponse(err);
    return res.status(err.statusCode).json(errorResponse);
  }

  // Handle unexpected errors
  logError(err); // Log the unexpected error
  return res.status(500).json({
    success: false,
    userMessage: "An unexpected error occurred.",
    errorCode: "ERR_UNKNOWN_ERROR",
    timestamp: new Date().toISOString(),
  });
}