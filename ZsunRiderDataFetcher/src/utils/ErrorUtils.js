"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertMessageError = exports.ServerError = exports.ValidationError = void 0;
exports.throwValidationError = throwValidationError;
exports.throwServerErrorWithContext = throwServerErrorWithContext;
exports.throwAlertMessageError = throwAlertMessageError;
exports.enrichErrorContext = enrichErrorContext;
exports.isValidationError = isValidationError;
exports.getErrorMessage = getErrorMessage;
exports.toError = toError;
/**
 * Represents a validation error intended for user-facing scenarios.
 * Includes a code and structured context for error handling.
 */
class ValidationError extends Error {
    constructor(code, message, context = {}) {
        super(message);
        this.name = "ValidationError";
        this.code = code;
        this.context = context;
        Object.setPrototypeOf(this, ValidationError.prototype);
        // Removed Error.captureStackTrace for compatibility
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
/**
 * Represents a server error for system or unexpected failures.
 * Includes a code and structured context for error handling.
 */
class ServerError extends Error {
    constructor(code, message, context = {}) {
        super(message);
        this.name = "ServerError";
        this.code = code;
        this.context = context;
        Object.setPrototypeOf(this, ServerError.prototype);
        // Removed Error.captureStackTrace for compatibility
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
/**
 * Represents an alert message error for user-facing alerts.
 * Used for handled exceptions that should be shown directly to the user.
 */
class AlertMessageError extends Error {
    constructor(code, message, context = {}) {
        super(message);
        this.name = "AlertMessageError";
        this.code = code;
        this.context = context;
        Object.setPrototypeOf(this, AlertMessageError.prototype);
        // Removed Error.captureStackTrace for compatibility
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
exports.AlertMessageError = AlertMessageError;
/**
 * Helper to throw a ValidationError with structured context.
 */
function throwValidationError(errorCodeEnum, errorMessage, operationName, nameOfFunctionThatThrew, moreDetails) {
    throw new ValidationError(errorCodeEnum, errorMessage, {
        operationName,
        nameOfFunctionThatThrew,
        errorCode: errorCodeEnum,
        moreDetails
    });
}
/**
 * Helper to throw a ServerError with structured context.
 */
function throwServerErrorWithContext(code, message, operationName, callsite, details) {
    throw new ServerError(code, message, {
        operationName,
        callsite,
        errorCode: code,
        details
    });
}
/**
 * Helper to throw an AlertMessageError with structured context.
 */
function throwAlertMessageError(code, message, operationName, callsite, details) {
    throw new AlertMessageError(code, message, {
        operationName,
        callsite,
        errorCode: code,
        details
    });
}
/**
 * Enriches the error's context with additional properties.
 * Merges the provided context into the error's existing context.
 */
function enrichErrorContext(err, context) {
    if (typeof err.context !== "object" || err.context === null) {
        err.context = {};
    }
    for (const key in context) {
        if (Object.prototype.hasOwnProperty.call(context, key)) {
            err.context[key] = context[key];
        }
    }
    return err;
}
/**
 * Type guard to check if an error is a ValidationError.
 */
function isValidationError(err) {
    return err instanceof ValidationError;
}
/**
 * Type guard to check if an error is a ServerError.
 */
//export function isServerError(err: any): err is ServerError {
//    return err instanceof ServerError;
//}
/**
 * Type guard to check if an error is an AlertMessageError.
 */
//export function isAlertMessageError(err: any): err is AlertMessageError {
//    return err instanceof AlertMessageError;
//}
/**
* Safely extracts the error message from any error type.
*/
function getErrorMessage(error) {
    if (error && typeof error.message === "string") {
        return error.message;
    }
    return String(error);
}
/**
 * Safely casts any error to Error if possible.
 */
function toError(error) {
    return error instanceof Error ? error : undefined;
}
