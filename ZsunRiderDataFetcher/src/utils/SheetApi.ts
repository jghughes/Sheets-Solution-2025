export interface ISheetApi {
    sheetExists(name: string): boolean;
    insertSheet(name: string): void;
    deleteSheet(name: string): void;
    renameSheet(oldName: string, newName: string): void;
    clearSheet(name: string): void;
    appendRow(name: string, row: any[]): void;
    setValues(
        name: string,
        startRow: number,
        startCol: number,
        numRows: number,
        numCols: number,
        values: any[][]
    ): void;
    updateRow(name: string, rowIdx: number, values: any[]): void;
    getRow(name: string, rowIdx: number): any[] | null;
    getAllRows(name: string): any[][];
    getColumn(name: string, colIdx: number): any[];
    getSheetNames(): string[];
    getCellValue(name: string, rowIdx: number, colIdx: number): any | null;
    setCellValue(name: string, rowIdx: number, colIdx: number, value: any): void;
    getSpreadsheetTimeZone(): string;
}
export class SheetApi implements ISheetApi {
    private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;

    constructor(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
        this.spreadsheet = spreadsheet;
    }

    sheetExists(name: string): boolean {
        return !!this.spreadsheet.getSheetByName(name);
    }

    insertSheet(name: string): void {
        this.spreadsheet.insertSheet(name);
    }

    deleteSheet(name: string): void {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) this.spreadsheet.deleteSheet(sheet);
    }

    renameSheet(oldName: string, newName: string): void {
        const sheet = this.spreadsheet.getSheetByName(oldName);
        if (sheet) sheet.setName(newName);
    }

    clearSheet(name: string): void {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) sheet.clear();
    }

    appendRow(name: string, row: any[]): void {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) sheet.appendRow(row);
    }

    setValues(
        name: string,
        startRow: number,
        startCol: number,
        numRows: number,
        numCols: number,
        values: any[][]
    ): void {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.getRange(startRow, startCol, numRows, numCols).setValues(values);
        }
    }

    updateRow(name: string, rowIdx: number, values: any[]): void {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.getRange(rowIdx + 1, 1, 1, values.length).setValues([values]);
        }
    }

    getRow(name: string, rowIdx: number): any[] | null {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            const range = sheet.getRange(rowIdx + 1, 1, 1, sheet.getLastColumn());
            return range.getValues()[0];
        }
        return null;
    }

    getAllRows(name: string): any[][] {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            const lastRow = sheet.getLastRow();
            const lastCol = sheet.getLastColumn();
            if (lastRow > 0 && lastCol > 0) {
                return sheet.getRange(1, 1, lastRow, lastCol).getValues();
            }
        }
        return [];
    }

    getColumn(name: string, colIdx: number): any[] {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            const lastRow = sheet.getLastRow();
            if (lastRow > 0) {
                // colIdx is zero-based, Google Sheets is one-based
                return sheet.getRange(1, colIdx + 1, lastRow, 1).getValues().map(row => row[0]);
            }
        }
        return [];
    }

    getSheetNames(): string[] {
        return this.spreadsheet.getSheets().map(sheet => sheet.getName());
    }

    getCellValue(name: string, rowIdx: number, colIdx: number): any | null {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            // Convert zero-based to one-based indices
            const value = sheet.getRange(rowIdx + 1, colIdx + 1, 1, 1).getValue();
            return value;
        }
        return null;
    }

    setCellValue(name: string, rowIdx: number, colIdx: number, value: any): void {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.getRange(rowIdx + 1, colIdx + 1, 1, 1).setValue(value);
        }
    }

    getSpreadsheetTimeZone(): string {
        try {
            return this.spreadsheet.getSpreadsheetTimeZone() || "Etc/UTC";
        } catch (err) {
            return "Etc/UTC";
        }
    }
}