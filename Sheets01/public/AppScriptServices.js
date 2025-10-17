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
 * Writes an array of rider objects to a specified sheet in the active Google Spreadsheet.
 *
 * - If the sheet named `nameOfSheet` does not exist, it is created and column headers are added.
 * - If the sheet exists, all its contents (including headers) are cleared before writing new data.
 * - Only specific rider properties are included as columns:
 *   "Zwift ID", "Name", "Zwift Cat Open", "Zwift Cat Female", "Zwift ZRS Score",
 *   "ZwiftRacing Cat Num", "ZwiftRacing Cat Name", "ZwiftRacing Velo rating", "ZwiftRacing zFTP (W)".
 * - Each rider object is mapped to a row, with missing properties filled as empty strings.
 *
 * @param {Object[]} riders - Array of rider objects to write. Each object should contain the specified properties.
 * @param {string} nameOfSheet - The name of the sheet to write data to.
 */
function writeRidersToSheet(riders, nameOfSheet) {
    // Define the headers and corresponding property names as tuples
    var columns = [
        ["Zwift ID", "zwiftId"],
        ["Name", "name"],
        ["Zwift Cat Open", "zwiftCatOpen"],
        ["Zwift Cat Female", "zwiftCatFemale"],
        ["Zwift ZRS Score", "zwiftZrsScore"],
        ["ZwiftRacing Cat Num", "zwiftRacingAppCatNum"],
        ["ZwiftRacing Cat Name", "zwiftRacingAppCatName"],
        ["ZwiftRacing Velo rating", "zwiftRacingAppVeloRating"],
        ["ZwiftRacing zFTP (W)", "zwiftRacingAppZpFtpWatts"]
    ];

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(nameOfSheet);

    // Create the sheet if it doesn't exist, otherwise clear it
    if (!sheet) {
        sheet = ss.insertSheet(nameOfSheet);
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