import { IErrorContext } from "../interfaces/IErrorContext";

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
export function getErrorMessage(error: any): string {
    if (error && typeof error.message === "string") {
        return error.message;
    }
    return String(error);
}

/**
 * Safely casts any error to Error if possible.
 */
export function toError(error: any): Error | undefined {
    return error instanceof Error ? error : undefined;
}