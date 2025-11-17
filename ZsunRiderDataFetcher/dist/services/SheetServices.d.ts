/**
 * Shows a toast message in the active spreadsheet.
 * Falls back to Logger logging if SpreadsheetApp is unavailable.
 * Throws structured errors for critical failures.
 */
export declare function showToast(message: string, title: string, timeoutSeconds: number): void;
/**
 * Ensures a sheet with the given name exists and has the specified header row.
 * If the sheet does not exist, it is created. If the first cell is empty or the sheet was created, the header is set.
 * Throws structured errors for invalid input or critical failures.
 */
export declare function ensureSheetWithHeader(ss: GoogleAppsScript.Spreadsheet.Spreadsheet, name: string, headerRow: string[]): GoogleAppsScript.Spreadsheet.Sheet;
export declare function reportError(message: string, operationName: string, err: Error): void;
export declare function appendLogRow(rowArray: (string | number | boolean | Date)[], sheetName: string, maxRows: number): void;
export declare function getSpreadsheetTimeZone(): string;
export declare function formatIsoToSheetTz(isoString: string): string;
//# sourceMappingURL=SheetServices.d.ts.map