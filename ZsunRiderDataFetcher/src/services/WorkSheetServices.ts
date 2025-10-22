import {
    throwValidationError,
    throwServerErrorWithContext,
    isValidationError,
    validationErrorCode,
    serverErrorCode
} from "../utils/ErrorUtils";

export function showHelpDocument() {
    try {
        const html = HtmlService.createHtmlOutputFromFile("src/ui/Help")
            .setWidth(760)
            .setHeight(640);
        SpreadsheetApp.getUi().showModalDialog(html, "Help");
    } catch (err) {
        const msg = err?.message ?? String(err);
        throwValidationError(
            "help_document_error",
            `showHelpDocument failed: ${msg}`,
            "showHelpDocument",
            "showHelpDocument",
            { originalError: err }
        );
    }
}

/**
 * Helper to normalize error messages for logging.
 */
function getErrorMessage(err: any): string {
    if (err && typeof err.message === "string") {
        return err.message;
    }
    return String(err);
}

export function reportError(message: string, operationName: string, err: Error): void {
    try {
        // Extract error type and code for structured logging
        const errorType = err && err.name ? err.name : "";
        const errorCode = (err as any)?.code || (err as any)?.errorCode || "";
        const composedMessage = `${message || ""}${err && err.message ? ` - ${err.message}` : ""}`;
        // New row: Timestamp, ErrorType, ErrorCode, Operation, Message
        const row: (string | Date)[] = [
            new Date(),
            errorType,
            errorCode,
            operationName || "",
            composedMessage
        ];
        appendLogRow(row, "ErrorLog", 1000);
        Logger.log(`${operationName || ""}: ${composedMessage}`);
    } catch (err) {
        Logger.log(`reportError failed: ${getErrorMessage(err)}`);
    }
}


/**
 * Shows a toast message in the active spreadsheet.
 * Falls back to Logger logging if SpreadsheetApp is unavailable.
 * Throws structured errors for critical failures.
 */
export function showToast(message: string, title: string, timeoutSeconds: number): void {
    try {
        if (!message || typeof message !== "string") {
            throwValidationError(
                validationErrorCode.missingRequiredField,
                "Toast message is required.",
                "showToast",
                "showToast",
                { message, title, timeoutSeconds }
            );
        }
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        if (!ss) {
            throwServerErrorWithContext(
                serverErrorCode.serviceUnavailable,
                "No active spreadsheet available for toast.",
                "showToast",
                "showToast",
                { message, title, timeoutSeconds }
            );
        }
        ss.toast(message, title || "", timeoutSeconds ?? 3);
    } catch (err) {
        if (isValidationError(err)) throw err;
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
export function ensureSheetWithHeader(
    ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
    name: string,
    headerRow: string[]
): GoogleAppsScript.Spreadsheet.Sheet {
    try {
        if (!ss || typeof ss.getSheetByName !== "function") {
            throwServerErrorWithContext(
                serverErrorCode.serviceUnavailable,
                "Spreadsheet object is invalid or unavailable.",
                "ensureSheetWithHeader",
                "ensureSheetWithHeader",
                { ss, name, headerRow }
            );
        }
        if (!name || typeof name !== "string") {
            throwValidationError(
                validationErrorCode.missingRequiredField,
                "Sheet name is required.",
                "ensureSheetWithHeader",
                "ensureSheetWithHeader",
                { name, headerRow }
            );
        }
        if (!Array.isArray(headerRow) || headerRow.length === 0) {
            throwValidationError(
                validationErrorCode.missingRequiredField,
                "Header row must be a non-empty array.",
                "ensureSheetWithHeader",
                "ensureSheetWithHeader",
                { name, headerRow }
            );
        }

        let sheet = ss.getSheetByName(name) as GoogleAppsScript.Spreadsheet.Sheet;
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
        } catch (err) {
            Logger.log(`ensureSheetWithHeader: failed to set header for sheet "${name}": ${getErrorMessage(err)}`);
            throwServerErrorWithContext(
                serverErrorCode.unexpectedError,
                `Failed to set header for sheet "${name}": ${getErrorMessage(err)}`,
                "ensureSheetWithHeader",
                "ensureSheetWithHeader",
                { name, headerRow, error: err }
            );
        }
        return sheet;
    } catch (err2) {
        if (isValidationError(err2)) throw err2;
        Logger.log(`ensureSheetWithHeader error: ${getErrorMessage(err2)}`);
        throwServerErrorWithContext(
            serverErrorCode.unexpectedError,
            `ensureSheetWithHeader failed: ${getErrorMessage(err2)}`,
            "ensureSheetWithHeader",
            "ensureSheetWithHeader",
            { name, headerRow, error: err2 }
        );
    }
    // Defensive: should never be reached, but satisfies TypeScript
    throw new Error("Unreachable code in ensureSheetWithHeader");
}


export function appendLogRow(rowArray: (string | number | boolean | Date)[], sheetName: string, maxRows: number): void {
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
            const header: string[] = ["Timestamp", "ErrorType", "ErrorCode", "Operation", "Message"];
            const sheet = ensureSheetWithHeader(ss, name, header);

            const row: (string | number | boolean | Date)[] = [...rowArray];
            if (!row[0]) row[0] = new Date();

            for (let i = 0; i < header.length; i++) {
                const v = row[i];
                if (v === undefined) {
                    row[i] = "";
                } else if (typeof v === "object" && !(v instanceof Date)) {
                    try {
                        row[i] = JSON.stringify(v);
                    } catch (err) {
                        row[i] = getErrorMessage(err);
                    }
                } else if (typeof v === "boolean" || typeof v === "number" || v instanceof Date) {
                    row[i] = String(v);
                } else if (typeof v !== "string") {
                    row[i] = "";
                }
            }

            sheet.appendRow(row as string[]);

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
                    } catch (error) {
                        Logger.log(`appendLogRow prune failed: ${getErrorMessage(error)}`);
                    }
                }
            }
        } finally {
            lock.releaseLock();
        }
    } catch (err2) {
        Logger.log(`appendLogRow failed: ${getErrorMessage(err2)} -- row=${JSON.stringify(rowArray)}`);
    }
}

export function getSpreadsheetTimeZone(): string {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        if (ss) return ss.getSpreadsheetTimeZone() || "Etc/UTC";
    } catch (err) {
        // ignore
    }
    return "Etc/UTC";
}

export function formatIsoToSheetTz(isoString: string): string {
    const tz = getSpreadsheetTimeZone();
    const d = new Date(isoString);
    return Utilities.formatDate(d, tz, "yyyy-MM-dd HH:mm:ss");
}