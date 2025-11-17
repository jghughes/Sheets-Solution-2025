"use strict";
/**
 * Unified, structured logger for Google Workspace Apps Script and development.
 * Outputs flat JSON log entries, including stack trace if available.
 * Usage: logEvent({ message, level, exception, extraFields })
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
exports.logEvent = logEvent;
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "INFO";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WARN"] = "WARN";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Logs an event with a specified level, message, optional exception, and extra fields.
 * @param options - Log event options.
 */
function logEvent(options) {
    const { message, level, exception, extraFields } = options;
    const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message
    };
    if (exception) {
        // If the exception has a toJson method, use it; otherwise, serialize standard Error
        if (typeof exception.toJson === "function") {
            Object.assign(logEntry, exception.toJson());
        }
        else {
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
function logJson(entry) {
    const json = JSON.stringify(entry);
    if (typeof Logger !== "undefined" && typeof Logger.log === "function") {
        Logger.log(json);
    }
    else {
        // For local development or Node.js
        console.log(json);
    }
}
//# sourceMappingURL=Logger.js.map