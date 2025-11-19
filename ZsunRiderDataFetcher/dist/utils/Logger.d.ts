/**
 * Unified, structured logger for Google Workspace Apps Script and development.
 * Outputs flat JSON log entries, including stack trace if available.
 * Usage: logEvent({ message, level, exception, extraFields })
 */
export declare enum LogLevel {
    INFO = "INFO",
    ERROR = "ERROR",
    WARN = "WARN",
    DEBUG = "DEBUG"
}
export interface ILogEventOptions {
    message: string;
    level: LogLevel;
    exception?: Error | undefined;
    extraFields?: Record<string, any> | undefined;
}
/**
 * Logs an event with a specified level, message, optional exception, and extra fields.
 * @param options - Log event options.
 */
export declare function logEvent(options: ILogEventOptions): void;
//# sourceMappingURL=Logger.d.ts.map