import {
    serverErrorCode,
    throwServerErrorWithContext,
    getErrorMessage,
} from "./ErrorUtils";
import {
    ensureSheetExists,
    logApiError,
    getPropertyNames,
    isValidZwiftId
} from "./SheetRowHelpers";
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
    let missingZwiftIdCount = 0;
    let errorCount = 0;

    try {
        ensureSheetExists(sheetApi, sheetName, true);

        if (!records || records.length === 0) {
            sheetApi.appendRow(sheetName, ["Zwift ID"]);
            logEvent({
                message: `No records to write in writeSheetRowsByZwiftId`,
                level: LogLevel.INFO,
                extraFields: { sheetName }
            });
            return;
        }

        const propertyNames = getPropertyNames(records);
        sheetApi.appendRow(sheetName, propertyNames);

        // Prepare data rows
        const dataRows: any[][] = [];
        for (let recordIndex = 0; recordIndex < records.length; recordIndex++) {
            const record = records[recordIndex];
            const zwiftId = record && record["zwiftId"];
            if (!isValidZwiftId(zwiftId)) {
                missingZwiftIdCount++;
                logEvent({
                    message: `Missing zwiftId in record, skipping row in writeSheetRowsByZwiftId`,
                    level: LogLevel.WARN,
                    extraFields: { sheetName, recordIndex }
                });
                continue;
            }
            const rowValues = propertyNames.map(propertyName => {
                const value = (record && record[propertyName as keyof IHasZwiftId] !== undefined)
                    ? record[propertyName as keyof IHasZwiftId]
                    : "";
                if (typeof value === "number") return value;
                if (typeof value === "string") return value;
                return value == null ? "" : String(value);
            });
            dataRows.push(rowValues);
        }

        // Write all data rows in bulk using updateContiguousRows
        if (dataRows.length > 0) {
            try {
                // Header is row 1, so data starts at row 2 (1-based)
                sheetApi.updateContiguousRows(sheetName, 2, dataRows);
            } catch (setValuesError) {
                errorCount += dataRows.length;
                logApiError(
                    `API error during updateContiguousRows in writeSheetRowsByZwiftId`,
                    setValuesError,
                    sheetName,
                    "updateContiguousRows"
                );
            }
        }

        logEvent({
            message: `writeSheetRowsByZwiftId summary`,
            level: LogLevel.INFO,
            extraFields: {
                sheetName,
                missingZwiftIdCount,
                errorCount,
                writtenCount: dataRows.length
            }
        });
    } catch (mainError) {
        logApiError(
            `writeSheetRowsByZwiftId error`,
            mainError,
            sheetName,
            "updateContiguousRows"
        );
        throwServerErrorWithContext(
            serverErrorCode.unexpectedError,
            `Failed to write data to sheet: ${getErrorMessage(mainError)}`,
            "writeSheetRowsByZwiftId",
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
    ensureSheetExists(sheetApi, sheetName);

    if (!items || items.length === 0) {
        logEvent({
            message: `No items to write in updateSheetRowsByZwiftId`,
            level: LogLevel.INFO,
            extraFields: { sheetName }
        });
        return;
    }

    const propertyNames = getPropertyNames(items);

    sheetApi.updateRow(sheetName, 1, propertyNames);

    const zwiftIdDictionary = toZwiftIdDictionary(items);

    let overwriteCount = 0;
    let errorCount = 0;

    const allSheetRows = sheetApi.getAllRows(sheetName);
    const rowLimit = Math.min(allSheetRows.length, maxRowLimit);

    // Find contiguous blocks
    let contiguousBlocks: { start: number, rows: any[][] }[] = [];
    let currentBlock: { start: number, rows: any[][] } | null = null;

    for (let rowIndex = 2; rowIndex <= rowLimit; rowIndex++) { // 1-based, skip header
        const sheetRow = allSheetRows[rowIndex - 1];
        const firstCellValue = sheetRow && sheetRow[0];

        if (!isValidZwiftId(firstCellValue) || !(firstCellValue in zwiftIdDictionary)) {
            if (currentBlock) {
                contiguousBlocks.push(currentBlock);
                currentBlock = null;
            }
            continue;
        }

        const matchingRecord = zwiftIdDictionary[firstCellValue];
        if (!matchingRecord) continue; // Guard against undefined

        const updatedRow = propertyNames.map(propertyName =>
            matchingRecord[propertyName as keyof IHasZwiftId] !== undefined
                ? matchingRecord[propertyName as keyof IHasZwiftId]
                : ""
        );

        if (!currentBlock) {
            currentBlock = { start: rowIndex, rows: [updatedRow] };
        } else {
            currentBlock.rows.push(updatedRow);
        }
        overwriteCount++;
    }
    if (currentBlock) {
        contiguousBlocks.push(currentBlock);
    }

    // Batch update each block
    for (const block of contiguousBlocks) {
        if (
            typeof block.start === "number" &&
            Array.isArray(block.rows) &&
            block.rows.length > 0 &&
            Array.isArray(block.rows[0])
        ) {
            try {
                sheetApi.updateContiguousRows(sheetName, block.start, block.rows);
            } catch (updateError) {
                errorCount += block.rows.length;
                logApiError(
                    `API error during updateContiguousRows in updateSheetRowsByZwiftId`,
                    updateError,
                    sheetName,
                    "updateContiguousRows"
                );
            }
        }
    }

    logEvent({
        message: `updateSheetRowsByZwiftId summary`,
        level: LogLevel.INFO,
        extraFields: {
            sheetName,
            overwriteCount,
            errorCount,
            blockCount: contiguousBlocks.length
        }
    });
}