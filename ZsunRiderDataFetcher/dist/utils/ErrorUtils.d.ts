/**
 * Defines a structured context for error logging and propagation.
 * Allows extensibility for additional error metadata.
 */
export interface IErrorContext {
    operationName?: string;
    callsite?: string;
    errorCode?: string;
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
export declare const validationErrorCode: ValidationErrorCodeType;
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
export declare const serverErrorCode: ServerErrorCodeType;
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
export declare const alertMessageErrorCode: AlertMessageErrorCodeType;
/**
 * Represents a validation error intended for user-facing scenarios.
 * Includes a code and structured context for error handling.
 */
export declare class ValidationError extends Error {
    code: string;
    context: IErrorContext;
    constructor(code: string, message: string, context?: IErrorContext);
    toJson(): {
        name: string;
        code: string;
        message: string;
        context: IErrorContext;
        stack: string | undefined;
    };
}
/**
 * Represents a server error for system or unexpected failures.
 * Includes a code and structured context for error handling.
 */
export declare class ServerError extends Error {
    code: string;
    context: IErrorContext;
    constructor(code: string, message: string, context?: IErrorContext);
    toJson(): {
        name: string;
        code: string;
        message: string;
        context: IErrorContext;
        stack: string | undefined;
    };
}
/**
 * Represents an alert message error for user-facing alerts.
 * Used for handled exceptions that should be shown directly to the user.
 */
export declare class AlertMessageError extends Error {
    code: string;
    context: IErrorContext;
    constructor(code: string, message: string, context?: IErrorContext);
    toJson(): {
        name: string;
        code: string;
        message: string;
        context: IErrorContext;
        stack: string | undefined;
    };
}
/**
 * Helper to throw a ValidationError with structured context.
 */
export declare function throwValidationError(errorCodeEnum: string, errorMessage: string, operationName?: string, nameOfFunctionThatThrew?: string, moreDetails?: any): never;
/**
 * Helper to throw a ServerError with structured context.
 */
export declare function throwServerErrorWithContext(code: string, message: string, operationName?: string, callsite?: string, details?: any): never;
/**
 * Helper to throw an AlertMessageError with structured context.
 */
export declare function throwAlertMessageError(code: string, message: string, operationName?: string, callsite?: string, details?: any): never;
/**
 * Enriches the error's context with additional properties.
 * Merges the provided context into the error's existing context.
 */
export declare function enrichErrorContext<T extends {
    context?: IErrorContext;
}>(err: T, context: Partial<IErrorContext>): T;
/**
 * Type guard to check if an error is a ValidationError.
 */
export declare function isValidationError(err: any): err is ValidationError;
/**
 * Type guard to check if an error is a ServerError.
 */
export declare function isServerError(err: any): err is ServerError;
/**
 * Type guard to check if an error is an AlertMessageError.
 */
export declare function isAlertMessageError(err: any): err is AlertMessageError;
//# sourceMappingURL=ErrorUtils.d.ts.map