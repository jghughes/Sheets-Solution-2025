import {
    serverErrorCode,
    throwServerErrorWithContext,
    getErrorMessage,
} from "./ErrorUtils";
import {
    ensureSheetExists,
    logApiError,
    getPropertyNames,
    isValidZwiftIdInCell,
    toZwiftIdString

} from "./SheetRowHelpers";
import { toZwiftIdDictionary } from "./CollectionUtils";
import { logEvent, LogLevel } from "./Logger";
import { SheetApi } from "./SheetApi";
import { ZwiftIdBase } from "../models/ZwiftIdBase";

/**
 * Writes an array of items implementing ZwiftIdBase to a specified sheet.
 * @param sheetApi - Instance for sheet operations.
 * @param sheetName - Name of the sheet to write to.
 * @param records - Array of items implementing ZwiftIdBase.
 */
export function writeSheetRowsByZwiftId<T extends ZwiftIdBase>(
    sheetApi: SheetApi,
    sheetName: string,
    records: T[],
): string {
    sheetName = sheetName || "Dump";

    try {
        ensureSheetExists(sheetApi, sheetName, true);

        if (!records || records.length === 0) {
            sheetApi.updateRow(sheetName, 1, ["Zwift ID"]);
            const message = `Nothing for ${sheetName}`;
            logEvent({
                message: message,
                level: LogLevel.INFO,
                extraFields: { sheetName }
            });
            return message;
        }

        const propertyNames = getPropertyNames(records);
        sheetApi.updateRow(sheetName, 1, propertyNames);

        // Prepare data rows
        const dataRows: any[][] = [];
        let missingZwiftIdCount = 0;
        for (let recordIndex = 0; recordIndex < records.length; recordIndex++) {
            const record = records[recordIndex];
            const zwiftId = record && record["zwiftId"];
            if (!isValidZwiftIdInCell(zwiftId)) {
                missingZwiftIdCount++;
                logEvent({
                    message: `Missing zwiftId in record [${zwiftId}], skipping row in ${sheetName}`,
                    level: LogLevel.WARN,
                    extraFields: { sheetName, recordIndex }
                });
                continue;
            }
            const rowValues = propertyNames.map(propertyName => {
                const value = (record && record[propertyName as keyof ZwiftIdBase] !== undefined)
                    ? record[propertyName as keyof ZwiftIdBase]
                    : "";
                if (typeof value === "number") return value;
                if (typeof value === "string") return value;
                return value == null ? "" : String(value);
            });
            dataRows.push(rowValues);
        }

        // Write all data rows in bulk using updateContiguousRows
        let errorCount = 0;
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

        return `${dataRows.length} updates in "${sheetName}".`;
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
        return ""; // Unreachable, just obeying function signature
    }
}

/**
 * Updates the specified sheet with items implementing ZwiftIdBase.
 * Overwrites rows where the first cell matches a zwiftId in the items.
 * Uses batch update for efficiency.
 * @param sheetApi - Instance for sheet operations.
 * @param sheetName - Name of the sheet to update.
 * @param items - Array of items implementing ZwiftIdBase.
 * @param maxRowLimit - Maximum number of rows to process.
 */
export function updateSheetRowsByZwiftId<T extends ZwiftIdBase>(
    sheetApi: SheetApi,
    sheetName: string,
    items: T[],
    maxRowLimit?: number
): string {
    sheetName = sheetName || "Squad";
    if (typeof maxRowLimit !== "number") {
        maxRowLimit = 1000;
    }

    try {
        ensureSheetExists(sheetApi, sheetName);

        if (!items || items.length === 0) {
            const message = `Nothing for ${sheetName}`;
            logEvent({
                message: message,
                level: LogLevel.INFO,
                extraFields: { sheetName }
            });
            return message;
        }

        const propertyNames = getPropertyNames(items);
        // Write header in row 10
        sheetApi.updateRow(sheetName, 10, propertyNames);

        const zwiftIdDictionary = toZwiftIdDictionary(items);

        // check: Count of valid Zwift IDs in the dictionary
        let validIdsInDictionary = 0;
        for (const key in zwiftIdDictionary) {
            if (isValidZwiftIdInCell(key)) {
                validIdsInDictionary++;
            }
        }

        const allSheetRows = sheetApi.getAllRows(sheetName);
        // Adjust row limit to account for header at row 10, so data starts at row 11
        const rowLimit = Math.min(allSheetRows.length, maxRowLimit);

        const updatedRows: any[][] = [];
        let overwriteCount = 0;
        let errorCount = 0;
        let totalValidIds = 0;

        // Start processing from row 11 (1-based), skipping rows 1-9 and header at 10
        for (let rowIndex = 11; rowIndex <= rowLimit; rowIndex++) {
            const sheetRow = allSheetRows[rowIndex - 1];
            const firstCellValue = sheetRow && sheetRow[0];

            if (!isValidZwiftIdInCell(firstCellValue)) {
                updatedRows.push(sheetRow); // keep as is
                continue;
            }

            totalValidIds++;

            let zwiftIdString = toZwiftIdString(firstCellValue);
            let record: T | undefined = zwiftIdDictionary[zwiftIdString];
            if (!record) {
                record = { zwiftId: zwiftIdString } as T;
            }

            const updatedRow = propertyNames.map(propertyName =>
                record && record[propertyName as keyof ZwiftIdBase] !== undefined
                    ? record[propertyName as keyof ZwiftIdBase]
                    : ""
            );
            updatedRows.push(updatedRow);
            overwriteCount++;
        }

        // Batch update all rows at once, starting at row 11
        if (updatedRows.length > 0) {
            try {
                sheetApi.updateContiguousRows(sheetName, 11, updatedRows);
            } catch (setValuesError) {
                errorCount += updatedRows.length;
                logApiError(
                    `API error during updateContiguousRows in updateSheetRowsByZwiftId`,
                    setValuesError,
                    sheetName,
                    "updateContiguousRows"
                );
            }
        }

        logEvent({
            message: `updateSheetRowsByZwiftId summary`,
            level: LogLevel.INFO,
            extraFields: {
                sheetName,
                overwriteCount,
                errorCount,
                totalValidIds
            }
        });

        logEvent({
            message: `Valid Zwift IDs found in dictionary`,
            level: LogLevel.INFO,
            extraFields: {
                sheetName,
                validIdsInDictionary
            }
        });

        return `${overwriteCount} updates in "${sheetName}".`;
    } catch (mainError) {
        logApiError(
            `updateSheetRowsByZwiftId error`,
            mainError,
            sheetName,
            "updateContiguousRows"
        );
        throwServerErrorWithContext(
            serverErrorCode.unexpectedError,
            `Failed to update data in sheet: ${getErrorMessage(mainError)}`,
            "updateSheetRowsByZwiftId",
            "updateContiguousRows",
            { sheetName }
        );
        return ""; // Unreachable
    }
}