import {
    getErrorMessage,
    toError
} from "./ErrorUtils";
import { logEvent, LogLevel } from "./LoggerUtils";
import { SpreadsheetService } from "../services/SpreadsheetService";

/**
 * Ensures the sheet exists. If not, inserts it. Optionally clears the sheet.
 * @param sheetServiceInstance - Instance for sheet operations.
 * @param sheetName - Name of the sheet.
 * @param clearIfExists - Whether to clear the sheet if it exists.
 */
export function ensureSheetExists(sheetServiceInstance: SpreadsheetService, sheetName: string, clearIfExists: boolean = false): void {
    if (!sheetServiceInstance.sheetExists(sheetName)) {
        sheetServiceInstance.insertSheet(sheetName);
    } else if (clearIfExists) {
        sheetServiceInstance.clearSheet(sheetName);
    }
}

/**
 * Logs an API error with consistent formatting.
 * @param message - Error message.
 * @param error - Error object.
 * @param sheetName - Name of the sheet.
 * @param operation - Operation name.
 */
export function logSpreadsheetServiceError(message: string, error: any, sheetName: string, operation: string): void {
    const errorType =
        typeof error === "object" && error !== null && "code" in error
            ? (error as any).code
            : (typeof error === "object" && error !== null && "name" in error
                ? (error as any).name
                : undefined);

    logEvent({
        message,
        level: LogLevel.ERROR,
        exception: toError(error),
        extraFields: {
            sheetName,
            operation,
            errorType,
            errorMessage: getErrorMessage(error)
        }
    });
}



/**
 * Checks if a Zwift ID is valid: must be a string consisting of digits only, or a positive integer.
 * @param zwiftId - The Zwift ID to validate.
 */
export function isValidZwiftIdInCell(zwiftId: any): boolean {
    // Accepts either a string of digits or an integer (number, not float)
    if (typeof zwiftId === "string" && /^[0-9]+$/.test(zwiftId)) {
        return true;
    }
    if (typeof zwiftId === "number" && Number.isInteger(zwiftId) && zwiftId >= 0) {
        return true;
    }
    return false;
}


/**
* Converts a valid Zwift ID to a string. If already a string, returns as is.
* Only call this after validating with isValidZwiftIdInCell.
* @param zwiftId - The Zwift ID to convert.
* @returns The Zwift ID as a string.
*/
export function toZwiftIdString(zwiftId: string | number): string {
    return typeof zwiftId === "string" ? zwiftId : zwiftId.toString();
}