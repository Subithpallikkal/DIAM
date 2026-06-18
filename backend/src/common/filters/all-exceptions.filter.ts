import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import {
  NotFoundException,
  ServerErrorException,
  ValidationException,
} from "../exceptions/api.exceptions";

interface HttpExceptionBody {
  success?: boolean;
  error?: unknown;
  message?: string | string[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let errorCode = "INTERNAL_SERVER_ERROR";
    let details: unknown;
    let validationErrors: unknown;

    if (exception instanceof ValidationException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      errorCode = "VALIDATION_ERROR";
      details = exception.details;
      validationErrors = exception.validationErrors;
    } else if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
      errorCode = exception.errorCode || "NOT_FOUND";
    } else if (exception instanceof ServerErrorException) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
      errorCode = exception.errorCode || "SERVER_ERROR";
      details = exception.details;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "object" && exceptionResponse !== null) {
        const body = exceptionResponse as HttpExceptionBody;

        if (body.success === false && body.error) {
          return response.status(status).json(exceptionResponse);
        }

        message = Array.isArray(body.message)
          ? body.message.join(", ")
          : body.message || exception.message;

        if (status === HttpStatus.UNAUTHORIZED) {
          errorCode = "UNAUTHORIZED";
        } else if (status === HttpStatus.FORBIDDEN) {
          errorCode = "FORBIDDEN";
        } else if (status === HttpStatus.NOT_FOUND) {
          errorCode = "NOT_FOUND";
        } else if (status === HttpStatus.BAD_REQUEST) {
          errorCode = "BAD_REQUEST";
        } else {
          errorCode = "HTTP_EXCEPTION";
        }

        if (Array.isArray(body.message)) {
          validationErrors = body.message;
        }
      } else {
        message = exception.message;

        if (status === HttpStatus.UNAUTHORIZED) {
          errorCode = "UNAUTHORIZED";
        } else if (status === HttpStatus.FORBIDDEN) {
          errorCode = "FORBIDDEN";
        } else if (status === HttpStatus.NOT_FOUND) {
          errorCode = "NOT_FOUND";
        } else {
          errorCode = "HTTP_EXCEPTION";
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    }

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message,
        errorCode,
        ...(details !== undefined && { details }),
        ...(validationErrors !== undefined && { validationErrors }),
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
