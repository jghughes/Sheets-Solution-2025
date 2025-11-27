"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheetApi = void 0;
class SheetApi {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
    }
    sheetExists(name) {
        return !!this.spreadsheet.getSheetByName(name);
    }
    insertSheet(name) {
        this.spreadsheet.insertSheet(name);
    }
    deleteSheet(name) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet)
            this.spreadsheet.deleteSheet(sheet);
    }
    renameSheet(oldName, newName) {
        const sheet = this.spreadsheet.getSheetByName(oldName);
        if (sheet)
            sheet.setName(newName);
    }
    clearSheet(name) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet)
            sheet.clear();
    }
    appendRow(name, row) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet)
            sheet.appendRow(row);
    }
    setValues(name, startRow, // 1-based
    startCol, // 1-based
    numRows, numCols, values) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.getRange(startRow, startCol, numRows, numCols).setValues(values);
        }
    }
    updateRow(name, rowIdx, values) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.getRange(rowIdx, 1, 1, values.length).setValues([values]);
        }
    }
    getRow(name, rowIdx) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            const range = sheet.getRange(rowIdx, 1, 1, sheet.getLastColumn());
            const values = range.getValues();
            return values[0] !== undefined ? values[0] : null;
        }
        return null;
    }
    getAllRows(name) {
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
    getColumn(name, colIdx) {
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
    getSheetNames() {
        return this.spreadsheet.getSheets().map(sheet => sheet.getName());
    }
    getCellValue(name, rowIdx, colIdx) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            // rowIdx and colIdx are 1-based
            const value = sheet.getRange(rowIdx, colIdx, 1, 1).getValue();
            return value;
        }
        return null;
    }
    setCellValue(name, rowIdx, colIdx, value) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.getRange(rowIdx, colIdx, 1, 1).setValue(value);
        }
    }
    getSpreadsheetTimeZone() {
        try {
            return this.spreadsheet.getSpreadsheetTimeZone() || "Etc/UTC";
        }
        catch (err) {
            return "Etc/UTC";
        }
    }
    // Row/Column Insert/Delete
    insertRow(name, rowIdx) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.insertRows(rowIdx, 1);
        }
    }
    deleteRow(name, rowIdx) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.deleteRow(rowIdx);
        }
    }
    insertColumn(name, colIdx) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.insertColumns(colIdx, 1);
        }
    }
    deleteColumn(name, colIdx) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.deleteColumn(colIdx);
        }
    }
    // Range Operations
    getRangeValues(name, startRow, // 1-based
    startCol, // 1-based
    numRows, numCols) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            return sheet.getRange(startRow, startCol, numRows, numCols).getValues();
        }
        return [];
    }
    setRangeValues(name, startRow, // 1-based
    startCol, // 1-based
    values) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet && values.length > 0 && values[0] !== undefined && values[0].length > 0) {
            sheet.getRange(startRow, startCol, values.length, values[0].length).setValues(values);
        }
    }
    /**
     * Updates a contiguous range of rows in the specified sheet.
     * @param name - The name of the sheet.
     * @param startRow - The 1-based index of the first row to update.
     * @param rows - An array of row arrays, each representing the values for a row.
     *               Each row must have the same number of columns.
     */
    updateContiguousRows(name, startRow, rows) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (!sheet || rows.length === 0 || rows[0] === undefined || rows[0].length === 0)
            return;
        const numRows = rows.length;
        const numCols = rows[0].length;
        sheet.getRange(startRow, 1, numRows, numCols).setValues(rows);
    }
    /**
     * Returns the last row with data in the specified sheet.
     * @param name - The name of the sheet.
     */
    getLastRow(name) {
        const sheet = this.spreadsheet.getSheetByName(name);
        return sheet ? sheet.getLastRow() : 0;
    }
}
exports.SheetApi = SheetApi;
