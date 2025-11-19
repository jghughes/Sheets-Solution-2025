export class SheetApi {
    private readonly spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;

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
        startRow: number, // 1-based
        startCol: number, // 1-based
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
            sheet.getRange(rowIdx, 1, 1, values.length).setValues([values]);
        }
    }

    getRow(name: string, rowIdx: number): any[] | null {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            const range = sheet.getRange(rowIdx, 1, 1, sheet.getLastColumn());
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
                // colIdx is 1-based
                return sheet.getRange(1, colIdx, lastRow, 1).getValues().map(row => row[0]);
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
            // rowIdx and colIdx are 1-based
            const value = sheet.getRange(rowIdx, colIdx, 1, 1).getValue();
            return value;
        }
        return null;
    }

    setCellValue(name: string, rowIdx: number, colIdx: number, value: any): void {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.getRange(rowIdx, colIdx, 1, 1).setValue(value);
        }
    }

    getSpreadsheetTimeZone(): string {
        try {
            return this.spreadsheet.getSpreadsheetTimeZone() || "Etc/UTC";
        } catch (err) {
            return "Etc/UTC";
        }
    }

    // Row/Column Insert/Delete
    insertRow(name: string, rowIdx: number): void {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.insertRows(rowIdx, 1);
        }
    }

    deleteRow(name: string, rowIdx: number): void {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.deleteRow(rowIdx);
        }
    }

    insertColumn(name: string, colIdx: number): void {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.insertColumns(colIdx, 1);
        }
    }

    deleteColumn(name: string, colIdx: number): void {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.deleteColumn(colIdx);
        }
    }

    // Range Operations
    getRangeValues(
        name: string,
        startRow: number, // 1-based
        startCol: number, // 1-based
        numRows: number,
        numCols: number
    ): any[][] {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            return sheet.getRange(startRow, startCol, numRows, numCols).getValues();
        }
        return [];
    }

    setRangeValues(
        name: string,
        startRow: number, // 1-based
        startCol: number, // 1-based
        values: any[][]
    ): void {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.getRange(startRow, startCol, values.length, values[0]?.length || 1).setValues(values);
        }
    }

    /**
     * Updates a contiguous range of rows in the specified sheet.
     * @param name - The name of the sheet.
     * @param startRow - The 1-based index of the first row to update.
     * @param rows - An array of row arrays, each representing the values for a row.
     *               Each row must have the same number of columns.
     */
    updateContiguousRows(name: string, startRow: number, rows: any[][]): void {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (!sheet || rows.length === 0) return;
        const numRows = rows.length;
        const numCols = rows[0].length;
        sheet.getRange(startRow, 1, numRows, numCols).setValues(rows);
    }

    /**
     * Returns the last row with data in the specified sheet.
     * @param name - The name of the sheet.
     */
    getLastRow(name: string): number {
        const sheet = this.spreadsheet.getSheetByName(name);
        return sheet ? sheet.getLastRow() : 0;
    }
}