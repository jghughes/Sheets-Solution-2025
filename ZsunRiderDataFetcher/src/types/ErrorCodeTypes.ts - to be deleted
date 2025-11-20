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

