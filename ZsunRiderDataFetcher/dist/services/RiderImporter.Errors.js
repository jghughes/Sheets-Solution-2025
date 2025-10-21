"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.ValidationError = void 0;
exports.throwServerError = throwServerError;
exports.isValidationError = isValidationError;
exports.isServerError = isServerError;
class ValidationError extends Error {
    constructor(code, message, context) {
        super(message);
        this.name = "ValidationError";
        this.code = code;
        this.context = context;
        Object.setPrototypeOf(this, ValidationError.prototype);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }
    toJson() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            context: this.context,
            stack: this.stack
        };
    }
}
exports.ValidationError = ValidationError;
class ServerError extends Error {
    constructor(code, message, context) {
        super(message);
        this.name = "ServerError";
        this.code = code || "server_error";
        this.context = context !== undefined ? context : null;
        Object.setPrototypeOf(this, ServerError.prototype);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ServerError);
        }
    }
    toJson() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            context: this.context,
            stack: this.stack
        };
    }
}
exports.ServerError = ServerError;
function throwServerError(code, message, context) {
    throw new ServerError(code, message, context);
}
function isValidationError(err) {
    return err instanceof ValidationError;
}
function isServerError(err) {
    return err instanceof ServerError;
}
//# sourceMappingURL=RiderImporter.Errors.js.map