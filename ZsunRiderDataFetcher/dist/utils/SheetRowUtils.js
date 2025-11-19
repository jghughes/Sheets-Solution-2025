"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSheetRowsByZwiftId = writeSheetRowsByZwiftId;
exports.updateSheetRowsByZwiftId = updateSheetRowsByZwiftId;
const ErrorUtils_1 = require("./ErrorUtils");
const SheetRowHelpers_1 = require("./SheetRowHelpers");
const CollectionUtils_1 = require("./CollectionUtils");
const Logger_1 = require("./Logger");
/**
 * Writes an array of items implementing IHasZwiftId to a specified sheet.
 * @param sheetApi - Instance for sheet operations.
 * @param sheetName - Name of the sheet to write to.
 * @param records - Array of items implementing IHasZwiftId.
 */
function writeSheetRowsByZwiftId(sheetApi, sheetName, records) {
    sheetName = sheetName || "Dump";
    let missingZwiftIdCount = 0;
    let errorCount = 0;
    try {
        (0, SheetRowHelpers_1.ensureSheetExists)(sheetApi, sheetName, true);
        if (!records || records.length === 0) {
            sheetApi.appendRow(sheetName, ["Zwift ID"]);
            (0, Logger_1.logEvent)({
                message: `No records to write in writeSheetRowsByZwiftId`,
                level: Logger_1.LogLevel.INFO,
                extraFields: { sheetName }
            });
            return;
        }
        const propertyNames = (0, SheetRowHelpers_1.getPropertyNames)(records);
        sheetApi.appendRow(sheetName, propertyNames);
        // Prepare data rows
        const dataRows = [];
        for (let recordIndex = 0; recordIndex < records.length; recordIndex++) {
            const record = records[recordIndex];
            const zwiftId = record && record["zwiftId"];
            if (!(0, SheetRowHelpers_1.isValidZwiftId)(zwiftId)) {
                missingZwiftIdCount++;
                (0, Logger_1.logEvent)({
                    message: `Missing zwiftId in record, skipping row in writeSheetRowsByZwiftId`,
                    level: Logger_1.LogLevel.WARN,
                    extraFields: { sheetName, recordIndex }
                });
                continue;
            }
            const rowValues = propertyNames.map(propertyName => {
                const value = (record && record[propertyName] !== undefined)
                    ? record[propertyName]
                    : "";
                if (typeof value === "number")
                    return value;
                if (typeof value === "string")
                    return value;
                return value == null ? "" : String(value);
            });
            dataRows.push(rowValues);
        }
        // Write all data rows in bulk using updateContiguousRows
        if (dataRows.length > 0) {
            try {
                // Header is row 1, so data starts at row 2 (1-based)
                sheetApi.updateContiguousRows(sheetName, 2, dataRows);
            }
            catch (setValuesError) {
                errorCount += dataRows.length;
                (0, SheetRowHelpers_1.logApiError)(`API error during updateContiguousRows in writeSheetRowsByZwiftId`, setValuesError, sheetName, "updateContiguousRows");
            }
        }
        (0, Logger_1.logEvent)({
            message: `writeSheetRowsByZwiftId summary`,
            level: Logger_1.LogLevel.INFO,
            extraFields: {
                sheetName,
                missingZwiftIdCount,
                errorCount,
                writtenCount: dataRows.length
            }
        });
    }
    catch (mainError) {
        (0, SheetRowHelpers_1.logApiError)(`writeSheetRowsByZwiftId error`, mainError, sheetName, "updateContiguousRows");
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `Failed to write data to sheet: ${(0, ErrorUtils_1.getErrorMessage)(mainError)}`, "writeSheetRowsByZwiftId", "updateContiguousRows", { sheetName });
    }
}
/**
 * Updates the specified sheet with items implementing IHasZwiftId.
 * Overwrites rows where the first cell matches a zwiftId in the items.
 * Uses batch update for efficiency.
 * @param sheetApi - Instance for sheet operations.
 * @param sheetName - Name of the sheet to update.
 * @param items - Array of items implementing IHasZwiftId.
 * @param maxRowLimit - Maximum number of rows to process.
 */
function updateSheetRowsByZwiftId(sheetApi, sheetName, items, maxRowLimit = 1000) {
    (0, SheetRowHelpers_1.ensureSheetExists)(sheetApi, sheetName);
    if (!items || items.length === 0) {
        (0, Logger_1.logEvent)({
            message: `No items to write in updateSheetRowsByZwiftId`,
            level: Logger_1.LogLevel.INFO,
            extraFields: { sheetName }
        });
        return;
    }
    const propertyNames = (0, SheetRowHelpers_1.getPropertyNames)(items);
    sheetApi.updateRow(sheetName, 1, propertyNames);
    const zwiftIdDictionary = (0, CollectionUtils_1.toZwiftIdDictionary)(items);
    let overwriteCount = 0;
    let errorCount = 0;
    const allSheetRows = sheetApi.getAllRows(sheetName);
    const rowLimit = Math.min(allSheetRows.length, maxRowLimit);
    // Find contiguous blocks
    let contiguousBlocks = [];
    let currentBlock = null;
    for (let rowIndex = 2; rowIndex <= rowLimit; rowIndex++) { // 1-based, skip header
        const sheetRow = allSheetRows[rowIndex - 1];
        const firstCellValue = sheetRow && sheetRow[0];
        if (!(0, SheetRowHelpers_1.isValidZwiftId)(firstCellValue) || !(firstCellValue in zwiftIdDictionary)) {
            if (currentBlock) {
                contiguousBlocks.push(currentBlock);
                currentBlock = null;
            }
            continue;
        }
        const matchingRecord = zwiftIdDictionary[firstCellValue];
        if (!matchingRecord)
            continue; // Guard against undefined
        const updatedRow = propertyNames.map(propertyName => matchingRecord[propertyName] !== undefined
            ? matchingRecord[propertyName]
            : "");
        if (!currentBlock) {
            currentBlock = { start: rowIndex, rows: [updatedRow] };
        }
        else {
            currentBlock.rows.push(updatedRow);
        }
        overwriteCount++;
    }
    if (currentBlock) {
        contiguousBlocks.push(currentBlock);
    }
    // Batch update each block
    for (const block of contiguousBlocks) {
        if (typeof block.start === "number" &&
            Array.isArray(block.rows) &&
            block.rows.length > 0 &&
            Array.isArray(block.rows[0])) {
            try {
                sheetApi.updateContiguousRows(sheetName, block.start, block.rows);
            }
            catch (updateError) {
                errorCount += block.rows.length;
                (0, SheetRowHelpers_1.logApiError)(`API error during updateContiguousRows in updateSheetRowsByZwiftId`, updateError, sheetName, "updateContiguousRows");
            }
        }
    }
    (0, Logger_1.logEvent)({
        message: `updateSheetRowsByZwiftId summary`,
        level: Logger_1.LogLevel.INFO,
        extraFields: {
            sheetName,
            overwriteCount,
            errorCount,
            blockCount: contiguousBlocks.length
        }
    });
}
//# sourceMappingURL=SheetRowUtils.js.map