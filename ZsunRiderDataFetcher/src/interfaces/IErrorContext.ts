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