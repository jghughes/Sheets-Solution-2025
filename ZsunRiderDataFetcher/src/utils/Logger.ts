/**
 * Unified, structured logger for Google Workspace Apps Script and development.
 * Outputs flat JSON log entries, including stack trace if available.
 * Usage: logEvent({ message, level, exception, extraFields })
 */

export enum LogLevel {
    INFO = "INFO",
    ERROR = "ERROR",
    WARN = "WARN",
    DEBUG = "DEBUG"
}

export interface ILogEventOptions {
    message: string;
    level: LogLevel;
    exception?: Error;
    extraFields?: Record<string, any>;
}

/**
 * Logs an event with a specified level, message, optional exception, and extra fields.
 * @param options - Log event options.
 */
export function logEvent(options: ILogEventOptions) {
    const {
        message,
        level,
        exception,
        extraFields
    } = options;

    const logEntry: Record<string, any> = {
        timestamp: new Date().toISOString(),
        level,
        message
    };

    if (exception) {
        // If the exception has a toJson method, use it; otherwise, serialize standard Error
        if (typeof (exception as any).toJson === "function") {
            Object.assign(logEntry, (exception as any).toJson());
        } else {
            logEntry["exception"] = {
                name: exception.name || "Error",
                message: exception.message || String(exception),
                stack: exception.stack || null
            };
        }
    }

    if (extraFields && typeof extraFields === "object") {
        Object.assign(logEntry, extraFields);
    }

    logJson(logEntry);
}

/**
 * Internal: Outputs JSON log entry to Apps Script Logger or console.
 */
function logJson(entry: any) {
    const json = JSON.stringify(entry);
    if (typeof Logger !== "undefined" && typeof Logger.log === "function") {
        Logger.log(json);
    } else {
        // For local development or Node.js
        console.log(json);
    }
}