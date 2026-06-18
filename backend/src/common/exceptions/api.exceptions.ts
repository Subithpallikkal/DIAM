export class ValidationException extends Error {
  constructor(
    message: string,
    public readonly details?: unknown,
    public readonly validationErrors?: unknown,
  ) {
    super(message);
    this.name = "ValidationException";
  }
}

export class NotFoundException extends Error {
  constructor(
    message: string,
    public readonly errorCode = "NOT_FOUND",
  ) {
    super(message);
    this.name = "NotFoundException";
  }
}

export class ServerErrorException extends Error {
  constructor(
    message: string,
    public readonly errorCode = "SERVER_ERROR",
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ServerErrorException";
  }
}
