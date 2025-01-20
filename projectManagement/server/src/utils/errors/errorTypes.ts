import { ApiError } from "./ApiError";

/** Represents validation-related errors (e.g., missing fields) */
export class ValidationError extends ApiError {
  constructor(
    message: string,
    userMessage?: string
  ) {
    super(message, 400, "VALIDATION_ERROR", userMessage);
  }
}

/** Represents authentication or authorization errors */
export class AuthError extends ApiError {
  constructor(
    message: string,
    userMessage?: string
  ) {
    super(message, 401, "AUTH_ERROR", userMessage);
  }
}

/** Represents resource not found errors */
export class NotFoundError extends ApiError {
  constructor(
    message: string,
    userMessage?: string
  ) {
    super(message, 404, "NOT_FOUND_ERROR", userMessage);
  }
}

/** Represents unexpected server errors */
export class ServerError extends ApiError {
  constructor(
    message: string,
    userMessage?: string
  ) {
    super(message, 500, "INTERNAL_SERVER_ERROR", userMessage);
  }
}