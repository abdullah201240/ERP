import { ApiError } from './ApiError';

export class ApiResponse {
  static success<T>(data: T, message: string = "Request successful") {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(error: ApiError) {
    return {
      success: false,
      message: error.userMessage,
      errorCode: error.errorCode,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    };
  }
}
