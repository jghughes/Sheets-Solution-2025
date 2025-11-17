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
    setValues(name, startRow, startCol, numRows, numCols, values) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.getRange(startRow, startCol, numRows, numCols).setValues(values);
        }
    }
    updateRow(name, rowIdx, values) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.getRange(rowIdx + 1, 1, 1, values.length).setValues([values]);
        }
    }
    getRow(name, rowIdx) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            const range = sheet.getRange(rowIdx + 1, 1, 1, sheet.getLastColumn());
            return range.getValues()[0];
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
                // colIdx is zero-based, Google Sheets is one-based
                return sheet.getRange(1, colIdx + 1, lastRow, 1).getValues().map(row => row[0]);
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
            // Convert zero-based to one-based indices
            const value = sheet.getRange(rowIdx + 1, colIdx + 1, 1, 1).getValue();
            return value;
        }
        return null;
    }
    setCellValue(name, rowIdx, colIdx, value) {
        const sheet = this.spreadsheet.getSheetByName(name);
        if (sheet) {
            sheet.getRange(rowIdx + 1, colIdx + 1, 1, 1).setValue(value);
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
}
exports.SheetApi = SheetApi;
//# sourceMappingURL=SheetApi.js.map