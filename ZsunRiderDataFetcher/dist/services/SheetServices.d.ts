declare function showToast(message: string, title: string, timeoutSeconds: number): void;
declare function ensureSheetWithHeader(ss: GoogleAppsScript.Spreadsheet.Spreadsheet, name: string, headerRow: string[]): GoogleAppsScript.Spreadsheet.Sheet;
declare function appendLogRow(rowArray: (string | number | boolean | Date)[], sheetName: string, maxRows: number): void;
declare function reportError(message: string, operationName: string, err: Error): void;
declare function getSpreadsheetTimeZone(): string;
declare function formatIsoToSheetTz(isoString: string): string;
//# sourceMappingURL=SheetServices.d.ts.map