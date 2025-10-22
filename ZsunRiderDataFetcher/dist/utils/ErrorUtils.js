"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.ValidationError = exports.serverErrorCode = exports.validationErrorCode = void 0;
exports.throwValidationError = throwValidationError;
exports.throwServerErrorWithContext = throwServerErrorWithContext;
exports.enrichErrorContext = enrichErrorContext;
exports.isValidationError = isValidationError;
exports.isServerError = isServerError;
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
 * Represents a validation error intended for user-facing scenarios.
 * Includes a code and structured context for error handling.
 */
class ValidationError extends Error {
    /**
     * Constructs a new ValidationError.
     * @param code - The error code.
     * @param message - The error message.
     * @param context - Additional error context.
     */
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
    /**
     * Serializes the error to a JSON object.
     */
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
    /**
     * Constructs a new ServerError.
     * @param code - The error code.
     * @param message - The error message.
     * @param context - Additional error context.
     */
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
    /**
     * Serializes the error to a JSON object.
     */
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
 * Helper to throw a ValidationError with structured context.
 * @param errorCodeEnum - The error code.
 * @param errorMessage - The error message.
 * @param operationName - The name of the operation where the error occurred.
 * @param nameOfFunctionThatThrew - The callsite or function name.
 * @param moreDetails - Additional error details.
 * @throws ValidationError
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
 * @param code - The error code.
 * @param message - The error message.
 * @param operationName - The name of the operation where the error occurred.
 * @param callsite - The callsite or function name.
 * @param details - Additional error details.
 * @throws ServerError
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
 * Enriches the error's context with additional properties.
 * Merges the provided context into the error's existing context.
 * @param err - The error object to enrich.
 * @param context - Additional context properties to merge.
 * @returns The enriched error object.
 */
function enrichErrorContext(err, context) {
    // Ensure err.context is always an object
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
 * @param err - The error to check.
 * @returns True if the error is a ValidationError.
 */
function isValidationError(err) {
    return err instanceof ValidationError;
}
/**
 * Type guard to check if an error is a ServerError.
 * @param err - The error to check.
 * @returns True if the error is a ServerError.
 */
function isServerError(err) {
    return err instanceof ServerError;
}
//# sourceMappingURL=ErrorUtils.js.map