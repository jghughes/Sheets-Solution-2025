/**
 * Appends a log entry to the "Logs" sheet in the active spreadsheet.
 * If the sheet does not exist, it is created with headers.
 * @param {string} operation - The operation being logged.
 * @param {string} status - "Success", "Failure", "Info", etc.
 * @param {string} message - Details about the log entry.
 */
function logToSheet(operation, status, message) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let logSheet = ss.getSheetByName("Logs");
    if (!logSheet) {
        logSheet = ss.insertSheet("Logs");
        logSheet.appendRow(["Timestamp", "Operation", "Status", "Message"]);
    }
    logSheet.appendRow([
        new Date(),
        operation,
        status,
        message
    ]);
}

/**
 * Centralized toast notification function.
 * Shows a toast message in the active spreadsheet and logs the event.
 * @param {string} message - The message to display.
 * @param {string} [title="Info"] - The title of the toast (e.g., "Success", "Info", "Warning", "Error").
 * @param {string} [operation] - Optional operation name for logging.
 */
function showToast(message, title, operation) {
    const toastTitle = title || "Info";
    SpreadsheetApp.getActiveSpreadsheet().toast(message, toastTitle);
    if (operation) {
        logToSheet(operation, toastTitle, message);
    }
    Logger.log(`Toast: [${toastTitle}] ${message}`);
}

/**
 * Centralized error reporting: shows a toast and logs the error.
 * @param {string} message - Error message to show and log.
 * @param {string} [operation] - Optional operation name for logging.
 * @param {Error} [error] - Optional error object for details.
 */
function reportError(message, operation, error) {
    showToast(message, "Error", operation);
    if (operation) {
        logToSheet(operation, "Failure", message + (error ? ` | Details: ${error}` : ""));
    }
    Logger.log(`Error: ${message}${error ? ` | Details: ${error}` : ""}`);
}

