// Lightweight GAS service wrappers (GAS global + CommonJS for local tests)
// Modernized for Apps Script V8 (uses const/let, template literals, optional chaining)

/**
 * Show a small spreadsheet toast. Falls back to console in non-GAS environments.
 */
function showToast(message, title, timeoutSeconds) {
    try {
        SpreadsheetApp.getActiveSpreadsheet().toast(message, title || "", timeoutSeconds ?? 3);
    } catch (e) {
        // fallback for non-GAS environment or tests
        console.log("showToast:", message, title, timeoutSeconds);
    }
}

/**
 * Ensure a sheet exists and has the expected header row.
 */
function _ensureSheetWithHeader(ss, name, headerRow) {
    let sheet = ss.getSheetByName(name);
    let created = false;
    if (!sheet) {
        sheet = ss.insertSheet(name);
        created = true;
    }
    try {
        const firstCell = sheet.getRange(1, 1).getValue();
        if (created || !firstCell) {
            sheet.clear();
            sheet.appendRow(headerRow);
        }
    } catch (e) {
        // Ignore — caller will handle fallback logging
    }
    return sheet;
}

/**
 * Append a structured log row to the ErrorLog sheet with locking and pruning.
 *
 * rowArray: array of values matching header (Timestamp, Level, Operation, Message, Stack, User, Context)
 * sheetName: optional; defaults to "ErrorLog"
 * maxRows: optional maximum number of log rows to keep (excluding header) — default 1000
 */
function appendLogRow(rowArray, sheetName, maxRows) {
    try {
        const LOCK_TIMEOUT_MS = 10000; // 10s
        const lock = LockService.getScriptLock();
        lock.waitLock(LOCK_TIMEOUT_MS);

        try {
            const ss = SpreadsheetApp.getActiveSpreadsheet();
            if (!ss) {
                console.log("appendLogRow: no active spreadsheet. row=", rowArray);
                return;
            }

            const name = sheetName || "ErrorLog";
            const header = ["Timestamp", "Level", "Operation", "Message", "Stack", "User", "Context"];
            const sheet = _ensureSheetWithHeader(ss, name, header);

            // Ensure row has at least as many columns as header
            const row = Array.isArray(rowArray) ? rowArray.slice() : [rowArray];

            // Prepend timestamp if not provided
            if (!row[0]) row[0] = new Date();

            // Normalize values: objects -> JSON, undefined/null -> ""
            for (let i = 0; i < header.length; i++) {
                const v = row[i];
                if (v === undefined || v === null) {
                    row[i] = "";
                } else if (typeof v === "object") {
                    try {
                        row[i] = JSON.stringify(v);
                    } catch (e) {
                        row[i] = String(v);
                    }
                } else {
                    row[i] = String(v);
                }
            }

            sheet.appendRow(row);

            // Prune old rows if the log grows beyond maxRows.
            const KEEP = (typeof maxRows === "number" && maxRows > 0) ? Math.floor(maxRows) : 1000;
            const totalRows = sheet.getLastRow();
            const headerRows = 1;
            const maxTotalRows = KEEP + headerRows;

            if (totalRows > maxTotalRows) {
                let rowsToDelete = totalRows - maxTotalRows;
                const startDeleteRow = 2; // preserve header
                const maxPhysicalRows = sheet.getMaxRows();
                if (startDeleteRow + rowsToDelete - 1 > maxPhysicalRows) {
                    rowsToDelete = Math.max(0, maxPhysicalRows - startDeleteRow + 1);
                }
                if (rowsToDelete > 0) {
                    try {
                        sheet.deleteRows(startDeleteRow, rowsToDelete);
                    } catch (e) {
                        try {
                            Logger.log(`appendLogRow prune failed: ${e && e.message}`);
                        } catch (ex) {
                            console.log("appendLogRow prune failed:", e && e.message);
                        }
                    }
                }
            }
        } finally {
            try { lock.releaseLock(); } catch (e) { /* ignore */ }
        }
    } catch (e) {
        try {
            Logger.log(`appendLogRow failed: ${(e && e.message)} -- row=${JSON.stringify(rowArray)}`);
        } catch (ex) {
            console.log("appendLogRow fallback:", e && e.message, rowArray);
        }
    }
}

/**
 * Enhanced reportError(message, operationName, err, optContext)
 * - message: short human message
 * - operationName: identifying string for the operation
 * - err: Error object or string (stack will be captured if present)
 * - optContext: optional object/string with additional context (e.g. target id)
 *
 * Writes a structured ERROR row to "ErrorLog".
 */
function reportError(message, operationName, err, optContext) {
    try {
        let stack = "";
        let errString = "";
        try {
            if (err && err.stack) stack = err.stack;
            errString = err && err.message ? err.message : (err ? String(err) : "");
        } catch (ex) {
            errString = String(err);
        }

        const user = _safeGetUserEmail();
        let contextStr = "";
        if (optContext !== undefined && optContext !== null) {
            try {
                contextStr = (typeof optContext === "object") ? JSON.stringify(optContext) : String(optContext);
            } catch (e) {
                contextStr = String(optContext);
            }
        }

        const composedMessage = `${message || ""}${errString ? " - " + errString : ""}`;
        const row = [new Date(), "ERROR", operationName || "", composedMessage, stack, user || "", contextStr || ""];
        appendLogRow(row, "ErrorLog", 1000);

        try {
            Logger.log(`${operationName || ""}: ${composedMessage}`);
        } catch (e) {
            console.log("reportError logger:", e && e.message);
        }
    } catch (e) {
        try { console.error("reportError:", message, err); } catch (ex) { /* ignore */ }
    }
}

/**
 * Safe attempt to get the active user's email; may require permission.
 */
function _safeGetUserEmail() {
    try {
        if (Session?.getActiveUser) {
            const u = Session.getActiveUser();
            if (u && typeof u.getEmail === "function") {
                return u.getEmail() || "";
            }
        }
    } catch (e) {
        // ignore permission/privacy errors
    }
    return "";
}

/**
 * Return the spreadsheet timezone, falling back to UTC.
 */
function getSpreadsheetTimeZone() {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        if (ss) return ss.getSpreadsheetTimeZone() || "Etc/UTC";
    } catch (e) {
        // ignore
    }
    return "Etc/UTC";
}

/**
 * Example: format an ISO timestamp to the spreadsheet timezone
 */
function formatIsoToSheetTZ(isoString) {
    const tz = getSpreadsheetTimeZone();
    const d = new Date(isoString);
    return Utilities.formatDate(d, tz, "yyyy-MM-dd HH:mm:ss");
}