"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSheetExists = ensureSheetExists;
exports.logApiError = logApiError;
exports.getPropertyNames = getPropertyNames;
exports.isValidZwiftId = isValidZwiftId;
const ErrorUtils_1 = require("./ErrorUtils");
const Logger_1 = require("./Logger");
/**
 * Ensures the sheet exists. If not, inserts it. Optionally clears the sheet.
 * @param sheetApi - Instance for sheet operations.
 * @param sheetName - Name of the sheet.
 * @param clearIfExists - Whether to clear the sheet if it exists.
 */
function ensureSheetExists(sheetApi, sheetName, clearIfExists = false) {
    if (!sheetApi.sheetExists(sheetName)) {
        sheetApi.insertSheet(sheetName);
    }
    else if (clearIfExists) {
        sheetApi.clearSheet(sheetName);
    }
}
/**
 * Logs an API error with consistent formatting.
 * @param message - Error message.
 * @param error - Error object.
 * @param sheetName - Name of the sheet.
 * @param operation - Operation name.
 */
function logApiError(message, error, sheetName, operation) {
    const errorType = typeof error === "object" && error !== null && "code" in error
        ? error.code
        : (typeof error === "object" && error !== null && "name" in error
            ? error.name
            : undefined);
    (0, Logger_1.logEvent)({
        message,
        level: Logger_1.LogLevel.ERROR,
        exception: (0, ErrorUtils_1.toError)(error),
        extraFields: {
            sheetName,
            operation,
            errorType,
            errorMessage: (0, ErrorUtils_1.getErrorMessage)(error)
        }
    });
}
/**
 * Gets property names from the first record, moving zwiftId to the front if present.
 * @param records - Array of items implementing IHasZwiftId.
 */
function getPropertyNames(records) {
    if (!records || records.length === 0 || typeof records[0] !== "object" || records[0] === null)
        return [];
    const propertyNames = Object.keys(records[0]);
    const zwiftIdIndex = propertyNames.indexOf("zwiftId");
    if (zwiftIdIndex > 0) {
        propertyNames.splice(zwiftIdIndex, 1);
        propertyNames.unshift("zwiftId");
    }
    return propertyNames;
}
/**
 * Checks if a Zwift ID is valid: must be a string consisting of digits only.
 * @param zwiftId - The Zwift ID to validate.
 */
function isValidZwiftId(zwiftId) {
    return typeof zwiftId === "string" && /^[0-9]+$/.test(zwiftId);
}
//# sourceMappingURL=SheetRowHelpers.js.map