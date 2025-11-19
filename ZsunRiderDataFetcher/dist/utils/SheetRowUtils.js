"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeSheetRowsByZwiftId = writeSheetRowsByZwiftId;
exports.updateSheetRowsByZwiftId = updateSheetRowsByZwiftId;
const ErrorUtils_1 = require("./ErrorUtils");
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
    let missingCount = 0;
    let errorCount = 0;
    try {
        // Ensure sheet exists and clear it
        const sheetExists = sheetApi.sheetExists(sheetName);
        if (!sheetExists) {
            sheetApi.insertSheet(sheetName);
        }
        else {
            sheetApi.clearSheet(sheetName);
        }
        if (!records || records.length === 0) {
            sheetApi.appendRow(sheetName, ["Zwift ID"]);
            (0, Logger_1.logEvent)({
                message: `No records to write in writeAllRecordsToSheet`,
                level: Logger_1.LogLevel.INFO,
                extraFields: { sheetName }
            });
            return;
        }
        // Use keys from the first record only, preserving order
        const firstRecord = records[0] || {};
        const keys = Object.keys(firstRecord);
        // Move zwiftId to the front if present
        const zwiftIdIndex = keys.indexOf("zwiftId");
        if (zwiftIdIndex > 0) {
            keys.splice(zwiftIdIndex, 1);
            keys.unshift("zwiftId");
        }
        sheetApi.appendRow(sheetName, keys);
        // Prepare data rows
        const data = [];
        for (let idx = 0; idx < records.length; idx++) {
            const r = records[idx];
            const zwiftId = r && r["zwiftId"];
            if (!zwiftId || typeof zwiftId !== "string" || zwiftId.trim().length === 0) {
                missingCount++;
                (0, Logger_1.logEvent)({
                    message: `Missing zwiftId in record, skipping row in writeAllRecordsToSheet`,
                    level: Logger_1.LogLevel.WARN,
                    extraFields: { sheetName, idx }
                });
                continue;
            }
            const row = keys.map(k => {
                const v = (r && r[k] !== undefined) ? r[k] : "";
                if (v instanceof Date)
                    return v;
                if (typeof v === "number")
                    return v;
                if (typeof v === "string")
                    return v;
                return v == null ? "" : String(v);
            });
            data.push(row);
        }
        // Write all data rows in bulk using updateContiguousRows
        if (data.length > 0) {
            try {
                // Header is row 1, so data starts at row 2 (1-based)
                sheetApi.updateContiguousRows(sheetName, 2, data);
            }
            catch (setValuesErr) {
                errorCount += data.length;
                (0, Logger_1.logEvent)({
                    message: `API error during updateContiguousRows in writeAllRecordsToSheet`,
                    level: Logger_1.LogLevel.ERROR,
                    exception: setValuesErr,
                    extraFields: {
                        sheetName,
                        operation: "updateContiguousRows",
                        errorType: (setValuesErr === null || setValuesErr === void 0 ? void 0 : setValuesErr.code) || (setValuesErr === null || setValuesErr === void 0 ? void 0 : setValuesErr.name),
                        errorMessage: (setValuesErr === null || setValuesErr === void 0 ? void 0 : setValuesErr.message) || String(setValuesErr)
                    }
                });
            }
        }
        (0, Logger_1.logEvent)({
            message: `writeAllRecordsToSheet summary`,
            level: Logger_1.LogLevel.INFO,
            extraFields: {
                sheetName,
                missingCount,
                errorCount,
                writtenCount: data.length
            }
        });
    }
    catch (mainErr) {
        (0, Logger_1.logEvent)({
            message: `writeAllRecordsToSheet error`,
            level: Logger_1.LogLevel.ERROR,
            exception: mainErr,
            extraFields: {
                sheetName,
                errorType: (mainErr === null || mainErr === void 0 ? void 0 : mainErr.code) || (mainErr === null || mainErr === void 0 ? void 0 : mainErr.name),
                errorMessage: (mainErr === null || mainErr === void 0 ? void 0 : mainErr.message) || String(mainErr)
            }
        });
        (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `Failed to write data to sheet: ${(mainErr === null || mainErr === void 0 ? void 0 : mainErr.message) || String(mainErr)}`, "writeAllRecordsToSheet", "updateContiguousRows", { sheetName });
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
    if (!sheetApi.sheetExists(sheetName)) {
        sheetApi.insertSheet(sheetName);
    }
    if (!items || items.length === 0) {
        (0, Logger_1.logEvent)({
            message: `No items to write in writeItemisedRecordsToSheet`,
            level: Logger_1.LogLevel.INFO,
            extraFields: { sheetName }
        });
        return;
    }
    const keys = Object.keys(items[0]);
    sheetApi.updateRow(sheetName, 1, keys);
    const dict = (0, CollectionUtils_1.toZwiftIdDictionary)(items);
    let overwriteCount = 0;
    let errorCount = 0;
    const allRows = sheetApi.getAllRows(sheetName);
    const rowLimit = Math.min(allRows.length, maxRowLimit);
    // Find contiguous blocks
    let blocks = [];
    let currentBlock = null;
    for (let rowIdx = 2; rowIdx <= rowLimit; rowIdx++) { // 1-based, skip header
        const row = allRows[rowIdx - 1];
        const cellValue = row && row[0];
        if (!cellValue || typeof cellValue !== "string" || !(cellValue in dict)) {
            if (currentBlock) {
                blocks.push(currentBlock);
                currentBlock = null;
            }
            continue;
        }
        const record = dict[cellValue];
        const newRow = keys.map(k => record[k] !== undefined ? record[k] : "");
        if (!currentBlock) {
            currentBlock = { start: rowIdx, rows: [newRow] };
        }
        else {
            currentBlock.rows.push(newRow);
        }
        overwriteCount++;
    }
    if (currentBlock) {
        blocks.push(currentBlock);
    }
    // Batch update each block
    for (const block of blocks) {
        try {
            sheetApi.updateContiguousRows(sheetName, block.start, block.rows);
        }
        catch (err) {
            errorCount += block.rows.length;
            (0, Logger_1.logEvent)({
                message: `API error during updateContiguousRows in writeItemisedRecordsToSheet`,
                level: Logger_1.LogLevel.ERROR,
                exception: err,
                extraFields: {
                    sheetName,
                    operation: "updateContiguousRows",
                    errorType: (err === null || err === void 0 ? void 0 : err.code) || (err === null || err === void 0 ? void 0 : err.name),
                    errorMessage: (err === null || err === void 0 ? void 0 : err.message) || String(err)
                }
            });
        }
    }
    (0, Logger_1.logEvent)({
        message: `writeItemisedRecordsToSheet summary`,
        level: Logger_1.LogLevel.INFO,
        extraFields: {
            sheetName,
            overwriteCount,
            errorCount,
            blockCount: blocks.length
        }
    });
}
//# sourceMappingURL=SheetRowUtils.js.map