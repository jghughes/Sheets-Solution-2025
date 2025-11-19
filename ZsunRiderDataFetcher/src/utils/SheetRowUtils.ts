import {
    serverErrorCode,
    throwServerErrorWithContext,
} from "./ErrorUtils";
import { toZwiftIdDictionary } from "./CollectionUtils";
import { logEvent, LogLevel } from "./Logger";
import { SheetApi } from "./SheetApi";
import { IHasZwiftId } from "../interfaces/IHasZwiftId";

/**
 * Writes an array of items implementing IHasZwiftId to a specified sheet.
 * @param sheetApi - Instance for sheet operations.
 * @param sheetName - Name of the sheet to write to.
 * @param records - Array of items implementing IHasZwiftId.
 */
export function writeSheetRowsByZwiftId<T extends IHasZwiftId>(
    sheetApi: SheetApi,
    sheetName: string,
    records: T[],
): void {
    sheetName = sheetName || "Dump";
    let missingCount = 0;
    let errorCount = 0;

    try {
        // Ensure sheet exists and clear it
        const sheetExists = sheetApi.sheetExists(sheetName);
        if (!sheetExists) {
            sheetApi.insertSheet(sheetName);
        } else {
            sheetApi.clearSheet(sheetName);
        }

        if (!records || records.length === 0) {
            sheetApi.appendRow(sheetName, ["Zwift ID"]);
            logEvent({
                message: `No records to write in writeAllRecordsToSheet`,
                level: LogLevel.INFO,
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
        const data: any[][] = [];
        for (let idx = 0; idx < records.length; idx++) {
            const r = records[idx];
            const zwiftId = r && r["zwiftId"];
            if (!zwiftId || typeof zwiftId !== "string" || zwiftId.trim().length === 0) {
                missingCount++;
                logEvent({
                    message: `Missing zwiftId in record, skipping row in writeAllRecordsToSheet`,
                    level: LogLevel.WARN,
                    extraFields: { sheetName, idx }
                });
                continue;
            }
            const row = keys.map(k => {
                const v = (r && r[k] !== undefined) ? r[k] : "";
                if (v instanceof Date) return v;
                if (typeof v === "number") return v;
                if (typeof v === "string") return v;
                return v == null ? "" : String(v);
            });
            data.push(row);
        }

        // Write all data rows in bulk using updateContiguousRows
        if (data.length > 0) {
            try {
                // Header is row 1, so data starts at row 2 (1-based)
                sheetApi.updateContiguousRows(sheetName, 2, data);
            } catch (setValuesErr) {
                errorCount += data.length;
                logEvent({
                    message: `API error during updateContiguousRows in writeAllRecordsToSheet`,
                    level: LogLevel.ERROR,
                    exception: setValuesErr,
                    extraFields: {
                        sheetName,
                        operation: "updateContiguousRows",
                        errorType: setValuesErr?.code || setValuesErr?.name,
                        errorMessage: setValuesErr?.message || String(setValuesErr)
                    }
                });
            }
        }

        logEvent({
            message: `writeAllRecordsToSheet summary`,
            level: LogLevel.INFO,
            extraFields: {
                sheetName,
                missingCount,
                errorCount,
                writtenCount: data.length
            }
        });
    } catch (mainErr) {
        logEvent({
            message: `writeAllRecordsToSheet error`,
            level: LogLevel.ERROR,
            exception: mainErr,
            extraFields: {
                sheetName,
                errorType: mainErr?.code || mainErr?.name,
                errorMessage: mainErr?.message || String(mainErr)
            }
        });
        throwServerErrorWithContext(
            serverErrorCode.unexpectedError,
            `Failed to write data to sheet: ${mainErr?.message || String(mainErr)}`,
            "writeAllRecordsToSheet",
            "updateContiguousRows",
            { sheetName }
        );
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
export function updateSheetRowsByZwiftId<T extends IHasZwiftId>(
    sheetApi: SheetApi,
    sheetName: string,
    items: T[],
    maxRowLimit: number = 1000
): void {
    if (!sheetApi.sheetExists(sheetName)) {
        sheetApi.insertSheet(sheetName);
    }

    if (!items || items.length === 0) {
        logEvent({
            message: `No items to write in writeItemisedRecordsToSheet`,
            level: LogLevel.INFO,
            extraFields: { sheetName }
        });
        return;
    }

    const keys = Object.keys(items[0]);
    sheetApi.updateRow(sheetName, 1, keys);

    const dict = toZwiftIdDictionary(items);

    let overwriteCount = 0;
    let errorCount = 0;

    const allRows = sheetApi.getAllRows(sheetName);
    const rowLimit = Math.min(allRows.length, maxRowLimit);

    // Find contiguous blocks
    let blocks: { start: number, rows: any[][] }[] = [];
    let currentBlock: { start: number, rows: any[][] } | null = null;

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
        } else {
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
        } catch (err) {
            errorCount += block.rows.length;
            logEvent({
                message: `API error during updateContiguousRows in writeItemisedRecordsToSheet`,
                level: LogLevel.ERROR,
                exception: err,
                extraFields: {
                    sheetName,
                    operation: "updateContiguousRows",
                    errorType: err?.code || err?.name,
                    errorMessage: err?.message || String(err)
                }
            });
        }
    }

    logEvent({
        message: `writeItemisedRecordsToSheet summary`,
        level: LogLevel.INFO,
        extraFields: {
            sheetName,
            overwriteCount,
            errorCount,
            blockCount: blocks.length
        }
    });
}