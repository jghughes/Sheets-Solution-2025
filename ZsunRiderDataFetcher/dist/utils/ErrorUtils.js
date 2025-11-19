"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertMessageError = exports.ServerError = exports.ValidationError = exports.alertMessageErrorCode = exports.serverErrorCode = exports.validationErrorCode = void 0;
exports.throwValidationError = throwValidationError;
exports.throwServerErrorWithContext = throwServerErrorWithContext;
exports.throwAlertMessageError = throwAlertMessageError;
exports.enrichErrorContext = enrichErrorContext;
exports.isValidationError = isValidationError;
exports.isServerError = isServerError;
exports.isAlertMessageError = isAlertMessageError;
exports.getErrorMessage = getErrorMessage;
exports.toError = toError;
/**
 * Predefined validation error codes for common validation failures.
 */
exports.validationErrorCode = {
    fileNotFound: "file_not_found",
    noRiders: "no_riders",
    noRecordsVisible: "no_records_visible",
    notDictionary: "not_dictionary",
    invalidFileFormat: "invalid_file_format",
    missingRequiredField: "missing_required_field",
    duplicateEntry: "duplicate_entry",
    invalidDate: "invalid_date",
    invalidEmail: "invalid_email",
    exceedsMaxRows: "exceeds_max_rows",
    emptyInput: "empty_input",
    malformedJson: "malformed_json",
    unauthorizedAccess: "unauthorized_access",
    networkUnavailable: "network_unavailable"
};
/**
 * Predefined server error codes for common server-side failures.
 */
exports.serverErrorCode = {
    unexpectedError: "unexpected_error",
    noInternet: "no_internet",
    unauthorizedAccess: "unauthorized_access",
    timeout: "timeout",
    serviceUnavailable: "service_unavailable"
};
/**
 * Predefined alert message error codes for common alert scenarios.
 */
exports.alertMessageErrorCode = {
    userActionRequired: "user_action_required",
    info: "info",
    warning: "warning",
    businessRule: "business_rule",
    custom: "custom"
};
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
        if (typeof Error.captureStackTrace === "function") {
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
        if (typeof Error.captureStackTrace === "function") {
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
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, AlertMessageError);
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
function isServerError(err) {
    return err instanceof ServerError;
}
/**
 * Type guard to check if an error is an AlertMessageError.
 */
function isAlertMessageError(err) {
    return err instanceof AlertMessageError;
}
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
//# sourceMappingURL=ErrorUtils.js.map