const StatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOTFOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

const ReasonStatusCode = {
  OK: 'OK',
  CREATED: 'Resource Created',
  NO_CONTENT: 'No Content',
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized Access',
  FORBIDDEN: 'Access Forbidden',
  NOTFOUND: 'Resource Not Found',
  CONFLICT: 'Conflict Occurred',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  SERVICE_UNAVAILABLE: 'Service Unavailable',
  GATEWAY_TIMEOUT: 'Gateway Timeout',
};

class ErrorResponse extends Error {
  status: number;

  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}

// 409 Conflict Error
class ConflictResponseError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

// 400 Bad Request Error
class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.BAD_REQUEST,
    statusCode = StatusCode.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

// 401 Unauthorized Error
class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.UNAUTHORIZED,
    statusCode = StatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

// 403 Forbidden Error
class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

// 404 Not Found Error
class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.NOTFOUND,
    statusCode = StatusCode.NOTFOUND
  ) {
    super(message, statusCode);
  }
}

// 500 Internal Server Error
class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.INTERNAL_SERVER_ERROR,
    statusCode = StatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}

// 503 Service Unavailable Error
class ServiceUnavailableError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.SERVICE_UNAVAILABLE,
    statusCode = StatusCode.SERVICE_UNAVAILABLE
  ) {
    super(message, statusCode);
  }
}

// 504 Gateway Timeout Error
class GatewayTimeoutError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.GATEWAY_TIMEOUT,
    statusCode = StatusCode.GATEWAY_TIMEOUT
  ) {
    super(message, statusCode);
  }
}

class RedisErrorResponse extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.INTERNAL_SERVER_ERROR,
    statusCode = StatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}

export {
  ErrorResponse,
  ConflictResponseError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
  InternalServerError,
  ServiceUnavailableError,
  GatewayTimeoutError,
  RedisErrorResponse,
};
