"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showToast = showToast;
exports.ensureSheetWithHeader = ensureSheetWithHeader;
exports.reportError = reportError;
exports.appendLogRow = appendLogRow;
exports.getSpreadsheetTimeZone = getSpreadsheetTimeZone;
exports.formatIsoToSheetTz = formatIsoToSheetTz;
const ErrorUtils_1 = require("../utils/ErrorUtils");
/**
 * Helper to normalize error messages for logging.
 */
function getErrorMessage(err) {
    if (err && typeof err.message === "string") {
        return err.message;
    }
    return String(err);
}
/**
 * Shows a toast message in the active spreadsheet.
 * Falls back to Logger logging if SpreadsheetApp is unavailable.
 * Throws structured errors for critical failures.
 */
function showToast(message, title, timeoutSeconds) {
    try {
        if (!message || typeof message !== "string") {
            (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.missingRequiredField, "Toast message is required.", "showToast", "showToast", { message, title, timeoutSeconds });
        }
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        if (!ss) {
            (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.serviceUnavailable, "No active spreadsheet available for toast.", "showToast", "showToast", { message, title, timeoutSeconds });
        }
        ss.toast(message, title || "", timeoutSeconds !== null && timeoutSeconds !== void 0 ? timeoutSeconds : 3);
    }
    catch (err) {
        if ((0, ErrorUtils_1.isValidationError)(err))
            throw err;
        // fallback for non-GAS environment or tests
        Logger.log(`showToast: ${message} | ${title} | ${timeoutSeconds}`);
        // Optionally, rethrow as a structured error for test environments
        // throwServerErrorWithContext(serverErrorCode.unexpectedError, `showToast failed: ${err}`, "showToast", "showToast", { message, title, timeoutSeconds });
    }
    // Defensive: should never be reached, but satisfies TypeScript
    // throw new Error("Unreachable code in showToast");
}
/**
 * Ensures a sheet with the given name exists and has the specified header row.
 * If the sheet does not exist, it is created. If the first cell is empty or the sheet was created, the header is set.
 * Throws structured errors for invalid input or critical failures.
 */
function ensureSheetWithHeader(ss, name, headerRow) {
    try {
        if (!ss || typeof ss.getSheetByName !== "function") {
            (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.serviceUnavailable, "Spreadsheet object is invalid or unavailable.", "ensureSheetWithHeader", "ensureSheetWithHeader", { ss, name, headerRow });
        }
        if (!name || typeof name !== "string") {
            (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.missingRequiredField, "Sheet name is required.", "ensureSheetWithHeader", "ensureSheetWithHeader", { name, headerRow });
        }
        if (!Array.isArray(headerRow) || headerRow.length === 0) {
            (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.missingRequiredField, "Header row must be a non-empty array.", "ensureSheetWithHeader", "ensureSheetWithHeader", { name, headerRow });
        }
        let sheet = ss.getSheetByName(name);
        let created = false;
        if (!sheet) {
            sheet = ss.insertSheet(name);
            created = true;
        }
        try {
            const firstCell = String(sheet.getRange(1, 1).getValue());
            if (created || firstCell === "") {
                sheet.clear();
                sheet.appendRow(headerRow);
            }
        }
        catch (err) {
            Logger.log(`ensureSheetWithHeader: failed to set header for sheet "${name}": ${getErrorMessage(err)}`);
            (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `Failed to set header for sheet "${name}": ${getErrorMessage(err)}`, "ensureSheetWithHeader", "ensureSheetWithHeader", { name, headerRow, error: err });
        }
        return sheet;
    }
    catch (err2) {
        if ((0, ErrorUtils_1.isValidationError)(err2))
            throw err2;
        Logger.log(`ensureSheetWithHeader error: ${getErrorMessage(err2)}`);
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `ensureSheetWithHeader failed: ${getErrorMessage(err2)}`, "ensureSheetWithHeader", "ensureSheetWithHeader", { name, headerRow, error: err2 });
    }
    // Defensive: should never be reached, but satisfies TypeScript
    throw new Error("Unreachable code in ensureSheetWithHeader");
}
function reportError(message, operationName, err) {
    try {
        // Extract error type and code for structured logging
        const errorType = err && err.name ? err.name : "";
        const errorCode = (err === null || err === void 0 ? void 0 : err.code) || (err === null || err === void 0 ? void 0 : err.errorCode) || "";
        const composedMessage = `${message || ""}${err && err.message ? ` - ${err.message}` : ""}`;
        // New row: Timestamp, ErrorType, ErrorCode, Operation, Message
        const row = [
            new Date(),
            errorType,
            errorCode,
            operationName || "",
            composedMessage
        ];
        appendLogRow(row, "ErrorLog", 1000);
        Logger.log(`${operationName || ""}: ${composedMessage}`);
    }
    catch (err) {
        Logger.log(`reportError failed: ${getErrorMessage(err)}`);
    }
}
function appendLogRow(rowArray, sheetName, maxRows) {
    try {
        const lockTimeoutMs = 10000;
        const lock = LockService.getScriptLock();
        lock.waitLock(lockTimeoutMs);
        try {
            const ss = SpreadsheetApp.getActiveSpreadsheet();
            if (!ss) {
                console.log("appendLogRow: no active spreadsheet. row=", rowArray);
                return;
            }
            // Updated header for structured error logging
            const name = sheetName || "ErrorLog";
            const header = ["Timestamp", "ErrorType", "ErrorCode", "Operation", "Message"];
            const sheet = ensureSheetWithHeader(ss, name, header);
            const row = [...rowArray];
            if (!row[0])
                row[0] = new Date();
            for (let i = 0; i < header.length; i++) {
                const v = row[i];
                if (v === undefined) {
                    row[i] = "";
                }
                else if (typeof v === "object" && !(v instanceof Date)) {
                    try {
                        row[i] = JSON.stringify(v);
                    }
                    catch (err) {
                        row[i] = getErrorMessage(err);
                    }
                }
                else if (typeof v === "boolean" || typeof v === "number" || v instanceof Date) {
                    row[i] = String(v);
                }
                else if (typeof v !== "string") {
                    row[i] = "";
                }
            }
            sheet.appendRow(row);
            const keep = (typeof maxRows === "number" && maxRows > 0) ? Math.floor(maxRows) : 1000;
            const totalRows = sheet.getLastRow();
            const headerRows = 1;
            const maxTotalRows = keep + headerRows;
            if (totalRows > maxTotalRows) {
                let rowsToDelete = totalRows - maxTotalRows;
                const startDeleteRow = 2;
                const maxPhysicalRows = sheet.getMaxRows();
                if (startDeleteRow + rowsToDelete - 1 > maxPhysicalRows) {
                    rowsToDelete = Math.max(0, maxPhysicalRows - startDeleteRow + 1);
                }
                if (rowsToDelete > 0) {
                    try {
                        sheet.deleteRows(startDeleteRow, rowsToDelete);
                    }
                    catch (error) {
                        Logger.log(`appendLogRow prune failed: ${getErrorMessage(error)}`);
                    }
                }
            }
        }
        finally {
            lock.releaseLock();
        }
    }
    catch (err2) {
        Logger.log(`appendLogRow failed: ${getErrorMessage(err2)} -- row=${JSON.stringify(rowArray)}`);
    }
}
function getSpreadsheetTimeZone() {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        if (ss)
            return ss.getSpreadsheetTimeZone() || "Etc/UTC";
    }
    catch (err) {
        // ignore
    }
    return "Etc/UTC";
}
function formatIsoToSheetTz(isoString) {
    const tz = getSpreadsheetTimeZone();
    const d = new Date(isoString);
    return Utilities.formatDate(d, tz, "yyyy-MM-dd HH:mm:ss");
}
//# sourceMappingURL=SheetServices.js.map