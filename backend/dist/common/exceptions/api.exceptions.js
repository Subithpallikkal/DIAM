"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerErrorException = exports.NotFoundException = exports.ValidationException = void 0;
class ValidationException extends Error {
    constructor(message, details, validationErrors) {
        super(message);
        this.details = details;
        this.validationErrors = validationErrors;
        this.name = "ValidationException";
    }
}
exports.ValidationException = ValidationException;
class NotFoundException extends Error {
    constructor(message, errorCode = "NOT_FOUND") {
        super(message);
        this.errorCode = errorCode;
        this.name = "NotFoundException";
    }
}
exports.NotFoundException = NotFoundException;
class ServerErrorException extends Error {
    constructor(message, errorCode = "SERVER_ERROR", details) {
        super(message);
        this.errorCode = errorCode;
        this.details = details;
        this.name = "ServerErrorException";
    }
}
exports.ServerErrorException = ServerErrorException;
//# sourceMappingURL=api.exceptions.js.map