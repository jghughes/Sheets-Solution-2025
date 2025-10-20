"use strict";
class ValidationError extends Error {
    constructor(code, message, context) {
        super(message);
        this.name = "ValidationError";
        this.code = code || "validation";
        this.context = context !== undefined ? context : null;
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