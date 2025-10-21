"use strict";
function showToast(message, title, timeoutSeconds) {
    try {
        SpreadsheetApp.getActiveSpreadsheet().toast(message, title || "", timeoutSeconds !== null && timeoutSeconds !== void 0 ? timeoutSeconds : 3);
    }
    catch (err) {
        // fallback for non-GAS environment or tests
        console.log("showToast:", message, title, timeoutSeconds);
    }
}
function ensureSheetWithHeader(ss, name, headerRow) {
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
        // Ignore � caller will handle fallback logging
    }
    return sheet;
}
function appendLogRow(rowArray, sheetName, maxRows) {
    var err;
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
            const name = sheetName || "ErrorLog";
            const header = ["Timestamp", "Level", "Operation", "Message"];
            const sheet = ensureSheetWithHeader(ss, name, header);
            // rowArray is always an array, so just copy it
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
                        row[i] = String(v);
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
                    catch (err) {
                        Logger.log(`appendLogRow prune failed: ${err && err.message}`);
                    }
                }
            }
        }
        finally {
            lock.releaseLock();
        }
    }
    catch (err) {
        Logger.log(`appendLogRow failed: ${(err && err.message)} -- row=${JSON.stringify(rowArray)}`);
    }
}
function reportError(message, operationName, err) {
    try {
        const composedMessage = `${message || ""}${err && err.message ? ` - ${err.message}` : ""}`;
        const row = [new Date(), "ERROR", operationName || "", composedMessage];
        appendLogRow(row, "ErrorLog", 1000);
        Logger.log(`${operationName || ""}: ${composedMessage}`);
    }
    catch (err) {
        Logger.log(`reportError failed: ${message} - ${err}`);
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