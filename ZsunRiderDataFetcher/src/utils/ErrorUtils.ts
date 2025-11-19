/**
 * Defines a structured context for error logging and propagation.
 * Allows extensibility for additional error metadata.
 */
export interface IErrorContext {
    operationName?: string | undefined;
    callsite?: string | undefined;
    errorCode?: string | undefined;
    details?: any;
    [key: string]: any;
}
/**
 * Object-based error codes for validation errors.
 * Used to categorize and identify validation error types.
 */
export type ValidationErrorCodeType = {
    fileNotFound: string;
    noRiders: string;
    noRecordsVisible: string;
    notDictionary: string;
    invalidFileFormat: string;
    missingRequiredField: string;
    duplicateEntry: string;
    invalidDate: string;
    invalidEmail: string;
    exceedsMaxRows: string;
    emptyInput: string;
    malformedJson: string;
    unauthorizedAccess: string;
    networkUnavailable: string;
};

/**
 * Predefined validation error codes for common validation failures.
 */
export const validationErrorCode: ValidationErrorCodeType = {
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
 * Object-based error codes for server errors.
 * Used to categorize and identify server error types.
 */
export type ServerErrorCodeType = {
    unexpectedError: string;
    noInternet: string;
    unauthorizedAccess: string;
    timeout: string;
    serviceUnavailable: string;
};

/**
 * Predefined server error codes for common server-side failures.
 */
export const serverErrorCode: ServerErrorCodeType = {
    unexpectedError: "unexpected_error",
    noInternet: "no_internet",
    unauthorizedAccess: "unauthorized_access",
    timeout: "timeout",
    serviceUnavailable: "service_unavailable"
};

/**
 * Object-based error codes for alert message errors.
 * Used to categorize and identify alert error types.
 */
export type AlertMessageErrorCodeType = {
    userActionRequired: string;
    info: string;
    warning: string;
    businessRule: string;
    custom: string;
};

/**
 * Predefined alert message error codes for common alert scenarios.
 */
export const alertMessageErrorCode: AlertMessageErrorCodeType = {
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
export class ValidationError extends Error {
    code: string;
    context: IErrorContext;

    constructor(code: string, message: string, context: IErrorContext = {}) {
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

/**
 * Represents a server error for system or unexpected failures.
 * Includes a code and structured context for error handling.
 */
export class ServerError extends Error {
    code: string;
    context: IErrorContext;

    constructor(code: string, message: string, context: IErrorContext = {}) {
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

/**
 * Represents an alert message error for user-facing alerts.
 * Used for handled exceptions that should be shown directly to the user.
 */
export class AlertMessageError extends Error {
    code: string;
    context: IErrorContext;

    constructor(code: string, message: string, context: IErrorContext = {}) {
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

/**
 * Helper to throw a ValidationError with structured context.
 */
export function throwValidationError(
    errorCodeEnum: string,
    errorMessage: string,
    operationName?: string,
    nameOfFunctionThatThrew?: string,
    moreDetails?: any
): never {
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
export function throwServerErrorWithContext(
    code: string,
    message: string,
    operationName?: string,
    callsite?: string,
    details?: any
): never {
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
export function throwAlertMessageError(
    code: string,
    message: string,
    operationName?: string,
    callsite?: string,
    details?: any
): never {
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
export function enrichErrorContext<T extends { context?: IErrorContext }>(
    err: T,
    context: Partial<IErrorContext>
): T {
    if (typeof err.context !== "object" || err.context === null) {
        err.context = {};
    }
    for (const key in context) {
        if (Object.prototype.hasOwnProperty.call(context, key)) {
            (err.context as any)[key] = context[key];
        }
    }
    return err;
}

/**
 * Type guard to check if an error is a ValidationError.
 */
export function isValidationError(err: any): err is ValidationError {
    return err instanceof ValidationError;
}

/**
 * Type guard to check if an error is a ServerError.
 */
export function isServerError(err: any): err is ServerError {
    return err instanceof ServerError;
}

/**
 * Type guard to check if an error is an AlertMessageError.
 */
export function isAlertMessageError(err: any): err is AlertMessageError {
    return err instanceof AlertMessageError;
}