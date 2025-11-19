import { SheetApi } from "./SheetApi";
import { IHasZwiftId } from "../interfaces/IHasZwiftId";
/**
 * Ensures the sheet exists. If not, inserts it. Optionally clears the sheet.
 * @param sheetApi - Instance for sheet operations.
 * @param sheetName - Name of the sheet.
 * @param clearIfExists - Whether to clear the sheet if it exists.
 */
export declare function ensureSheetExists(sheetApi: SheetApi, sheetName: string, clearIfExists?: boolean): void;
/**
 * Logs an API error with consistent formatting.
 * @param message - Error message.
 * @param error - Error object.
 * @param sheetName - Name of the sheet.
 * @param operation - Operation name.
 */
export declare function logApiError(message: string, error: any, sheetName: string, operation: string): void;
/**
 * Gets property names from the first record, moving zwiftId to the front if present.
 * @param records - Array of items implementing IHasZwiftId.
 */
export declare function getPropertyNames<T extends IHasZwiftId>(records: T[]): string[];
/**
 * Checks if a Zwift ID is valid: must be a string consisting of digits only.
 * @param zwiftId - The Zwift ID to validate.
 */
export declare function isValidZwiftId(zwiftId: any): boolean;
//# sourceMappingURL=SheetRowHelpers.d.ts.map