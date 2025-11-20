import {
    getErrorMessage,
    toError
} from "./ErrorUtils";
import { logEvent, LogLevel } from "./Logger";
import { SheetApi } from "./SheetApi";
import { ZwiftIdBase } from "../models/ZwiftIdBase";
/**
 * Ensures the sheet exists. If not, inserts it. Optionally clears the sheet.
 * @param sheetApi - Instance for sheet operations.
 * @param sheetName - Name of the sheet.
 * @param clearIfExists - Whether to clear the sheet if it exists.
 */
export function ensureSheetExists(sheetApi: SheetApi, sheetName: string, clearIfExists: boolean = false): void {
    if (!sheetApi.sheetExists(sheetName)) {
        sheetApi.insertSheet(sheetName);
    } else if (clearIfExists) {
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
export function logApiError(message: string, error: any, sheetName: string, operation: string): void {
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
 * Gets property names from the first record, moving zwiftId to the front if present.
 * @param records - Array of items implementing IHasZwiftId.
 */
export function getPropertyNames<T extends ZwiftIdBase>(records: T[]): string[] {
    if (!records || records.length === 0 || typeof records[0] !== "object" || records[0] === null) return [];
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
export function isValidZwiftId(zwiftId: any): boolean {
    return typeof zwiftId === "string" && /^[0-9]+$/.test(zwiftId);
}
