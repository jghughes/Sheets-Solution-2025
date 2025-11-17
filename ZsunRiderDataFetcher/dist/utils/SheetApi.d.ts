export interface ISheetApi {
    sheetExists(name: string): boolean;
    insertSheet(name: string): void;
    deleteSheet(name: string): void;
    renameSheet(oldName: string, newName: string): void;
    clearSheet(name: string): void;
    appendRow(name: string, row: any[]): void;
    setValues(name: string, startRow: number, startCol: number, numRows: number, numCols: number, values: any[][]): void;
    updateRow(name: string, rowIdx: number, values: any[]): void;
    getRow(name: string, rowIdx: number): any[] | null;
    getAllRows(name: string): any[][];
    getColumn(name: string, colIdx: number): any[];
    getSheetNames(): string[];
    getCellValue(name: string, rowIdx: number, colIdx: number): any | null;
    setCellValue(name: string, rowIdx: number, colIdx: number, value: any): void;
    getSpreadsheetTimeZone(): string;
}
export declare class SheetApi implements ISheetApi {
    private spreadsheet;
    constructor(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet);
    sheetExists(name: string): boolean;
    insertSheet(name: string): void;
    deleteSheet(name: string): void;
    renameSheet(oldName: string, newName: string): void;
    clearSheet(name: string): void;
    appendRow(name: string, row: any[]): void;
    setValues(name: string, startRow: number, startCol: number, numRows: number, numCols: number, values: any[][]): void;
    updateRow(name: string, rowIdx: number, values: any[]): void;
    getRow(name: string, rowIdx: number): any[] | null;
    getAllRows(name: string): any[][];
    getColumn(name: string, colIdx: number): any[];
    getSheetNames(): string[];
    getCellValue(name: string, rowIdx: number, colIdx: number): any | null;
    setCellValue(name: string, rowIdx: number, colIdx: number, value: any): void;
    getSpreadsheetTimeZone(): string;
}
//# sourceMappingURL=SheetApi.d.ts.map