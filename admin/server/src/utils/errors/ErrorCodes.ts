export const ErrorCodes = {
    // HTTP 400 - Bad Request
    BAD_REQUEST: {
      code: "ERR_BAD_REQUEST",
      message: "Bad request. Please check your input.",
      statusCode: 400,
    },
    
    // HTTP 401 - Unauthorized
    UNAUTHORIZED: {
      code: "ERR_UNAUTHORIZED",
      message: "Unauthorized access. Please log in.",
      statusCode: 401,
    },
    
    // HTTP 403 - Forbidden
    FORBIDDEN: {
      code: "ERR_FORBIDDEN",
      message: "Access is forbidden.",
      statusCode: 403,
    },
    
    // HTTP 404 - Not Found
    NOT_FOUND: {
      code: "ERR_NOT_FOUND",
      message: "Resource not found.",
      statusCode: 404,
    },
    CONFLICT: { 
      code: "CONFLICT", 
      message: "Conflict", 
      statusCode: 409 },

    
    // HTTP 500 - Internal Server Error
    INTERNAL_SERVER_ERROR: {
      code: "ERR_INTERNAL_SERVER_ERROR",
      message: "Internal server error. Please try again later.",
      statusCode: 500,
    },
    
    // HTTP 422 - Validation Error
    VALIDATION_ERROR: {
      code: "ERR_VALIDATION_ERROR",
      message: "Validation error. Please check your data.",
      statusCode: 422,
    },
    
    // HTTP 503 - Database or Service Error
    DATABASE_ERROR: {
      code: "ERR_DATABASE_ERROR",
      message: "Database error. Please try again later.",
      statusCode: 503,
    },
    
    // General fallback error
    UNKNOWN_ERROR: {
      code: "ERR_UNKNOWN_ERROR",
      message: "An unknown error occurred.",
      statusCode: 500,
    },
  };
  