import { ErrorCodes } from './ErrorCodes';
export class ApiError extends Error {
  public statusCode: number;
  public errorCode: string;
  public metadata?: any;
  public userMessage: string;
  public message: string;

  /**
   * Constructs an ApiError instance
   * @param message - Technical message for debugging
   * @param statusCode - HTTP status code (e.g., 400, 500)
   * @param errorCode - Application-specific error code (optional)
   * @param userMessage - User-friendly error message (optional)
   * @param metadata - Additional metadata (optional)
   */
  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = ErrorCodes.UNKNOWN_ERROR.code,
    userMessage?: string,
    metadata?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.userMessage = userMessage || "An unexpected error occurred.";
    this.metadata = metadata;
    this.message = message;

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
  
}
