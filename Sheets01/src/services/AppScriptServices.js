//javascript Sheets01\src\services\appScriptServices.js
// Lightweight GAS service wrappers (GAS global + CommonJS for local tests)

function showToast(message, title, timeoutSeconds) {
    try {
        SpreadsheetApp.getActiveSpreadsheet().toast(message, title || "", timeoutSeconds || 3);
    } catch (e) {
        // fallback for non-GAS environment or tests
        console.log("showToast:", message, title, timeoutSeconds);
    }
}

function logToSheet(message, sheetName) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheet = ss.getSheetByName(sheetName || "Log") || ss.insertSheet(sheetName || "Log");
        sheet.appendRow([new Date(), message]);
    } catch (e) {
        console.log("logToSheet:", message);
    }
}

function reportError(message, operationName, err) {
    try {
        // Example: write to a dedicated error log sheet and use Logger
        logToSheet(`${operationName}: ${message} - ${err && err.stack ? err.stack : err}`);
        Logger.log(`${operationName}: ${message} - ${err}`);
    } catch (e) {
        console.error("reportError:", message, err);
    }
}

// Export for Node tests and attach to global for GAS
(function () {
    const API = {
        showToast,
        logToSheet,
        reportError
    };

    if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = API;
        return;
    }

    var __root = (typeof globalThis !== "undefined") ? globalThis : (typeof this !== "undefined" ? this : {});
    __root.SheetsServices = __root.SheetsServices || {};
    Object.assign(__root.SheetsServices, API);
})();