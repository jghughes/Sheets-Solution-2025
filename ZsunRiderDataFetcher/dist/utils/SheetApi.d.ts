export declare class SheetApi {
    private readonly spreadsheet;
    constructor(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet);
    sheetExists(name: string): boolean;
    insertSheet(name: string): void;
    deleteSheet(name: string): void;
    renameSheet(oldName: string, newName: string): void;
    clearSheet(name: string): void;
    appendRow(name: string, row: any[]): void;
    setValues(name: string, startRow: number, // 1-based
    startCol: number, // 1-based
    numRows: number, numCols: number, values: any[][]): void;
    updateRow(name: string, rowIdx: number, values: any[]): void;
    getRow(name: string, rowIdx: number): any[] | null;
    getAllRows(name: string): any[][];
    getColumn(name: string, colIdx: number): any[];
    getSheetNames(): string[];
    getCellValue(name: string, rowIdx: number, colIdx: number): any | null;
    setCellValue(name: string, rowIdx: number, colIdx: number, value: any): void;
    getSpreadsheetTimeZone(): string;
    insertRow(name: string, rowIdx: number): void;
    deleteRow(name: string, rowIdx: number): void;
    insertColumn(name: string, colIdx: number): void;
    deleteColumn(name: string, colIdx: number): void;
    getRangeValues(name: string, startRow: number, // 1-based
    startCol: number, // 1-based
    numRows: number, numCols: number): any[][];
    setRangeValues(name: string, startRow: number, // 1-based
    startCol: number, // 1-based
    values: any[][]): void;
    /**
     * Updates a contiguous range of rows in the specified sheet.
     * @param name - The name of the sheet.
     * @param startRow - The 1-based index of the first row to update.
     * @param rows - An array of row arrays, each representing the values for a row.
     *               Each row must have the same number of columns.
     */
    updateContiguousRows(name: string, startRow: number, rows: any[][]): void;
    /**
     * Returns the last row with data in the specified sheet.
     * @param name - The name of the sheet.
     */
    getLastRow(name: string): number;
}
//# sourceMappingURL=SheetApi.d.ts.map