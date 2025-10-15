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

/**
 * Writes a list of rider objects to the "MasterList" sheet in the active spreadsheet.
 *
 * If the "MasterList" sheet does not exist, it is created and headers are added.
 * Only the following properties are included as columns:
 *   zwiftId, name, zwiftRacingAppZpFtpWatts, zwiftZrsScore, zwiftCatOpen, zwiftCatFemale,
 *   zwiftRacingAppCatNum, zwiftRacingAppScore, zwiftRacingAppCatName.
 * If the sheet already exists, it is fully cleared (including headers) before writing new data.
 *
 * @param {Object[]} riders - Array of rider objects, each with the specified properties.
 */
function writeRidersToSheet(riders) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("MasterList");

    // Define the headers and corresponding property names as tuples
    var columns = [
        ["Zwift ID", "zwiftId"],
        ["Name", "name"],
        ["ZwiftRacingApp zFTP (W)", "zwiftRacingAppZpFtpWatts"],
        ["Zwift ZRS Score", "zwiftZrsScore"],
        ["Zwift Cat Open", "zwiftCatOpen"],
        ["Zwift Cat Female", "zwiftCatFemale"],
        ["ZwiftRacingApp Cat Num", "zwiftRacingAppCatNum"],
        ["ZwiftRacingApp Score", "zwiftRacingAppScore"],
        ["ZwiftRacingApp Cat Name", "zwiftRacingAppCatName"]
    ];

    // Create the sheet if it doesn't exist, otherwise clear it
    if (!sheet) {
        sheet = ss.insertSheet("MasterList");
    } else {
        sheet.clear();
    }
    // Write headers
    sheet.appendRow(columns.map(function (col) { return col[0]; }));

    // Prepare data rows
    var data = riders.map(function (r) {
        return columns.map(function (col) {
            return r[col[1]] !== undefined ? r[col[1]] : "";
        });
    });

    if (data.length > 0) {
        sheet.getRange(2, 1, data.length, columns.length).setValues(data);
    }
}