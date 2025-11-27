import { SpreadsheetService} from "./SpreadsheetService";
import { ZwiftIdBase } from "../models/ZwiftIdBase";
import { ensureSheetExists, logSpreadsheetServiceError, isValidZwiftIdInCell, toZwiftIdString } from "../utils/SheetUtils";
import { getPropertyNames } from "../utils/ReflectionUtils";
import { toZwiftIdDictionary } from "../utils/CollectionUtils";
import { logEvent, LogLevel } from "../utils/LoggerUtils";
import { throwServerErrorWithContext, serverErrorCode, getErrorMessage } from "../utils/ErrorUtils";

/**
 * Writes an array of items implementing ZwiftIdBase to a specified sheet.
 * @param sheetServiceInstance - Instance for sheet operations.
 * @param sheetName - Name of the sheet to write to.
 * @param records - Array of items implementing ZwiftIdBase.
 */
export function writeSheetRowsByZwiftId<T extends ZwiftIdBase>(
    sheetServiceInstance: SpreadsheetService,
    sheetName: string,
    records: T[],
): string {
    sheetName = sheetName || "Dump";

    try {
        ensureSheetExists(sheetServiceInstance, sheetName, true);

        if (!records || records.length === 0) {
            sheetServiceInstance.updateRow(sheetName, 1, ["Zwift ID"]);
            const message = `Nothing for ${sheetName}`;
            logEvent({
                message: message,
                level: LogLevel.INFO,
                extraFields: { sheetName }
            });
            return message;
        }

        const propertyNames = getPropertyNames(records);
        sheetServiceInstance.updateRow(sheetName, 1, propertyNames);

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
                return value == null ? "" : String(value);
            });
            dataRows.push(rowValues);
        }

        // Write all data rows in bulk using updateContiguousRows
        let errorCount = 0;
        if (dataRows.length > 0) {
            try {
                // Header is row 1, so data starts at row 2 (1-based)
                sheetServiceInstance.updateContiguousRows(sheetName, 2, dataRows);
            } catch (setValuesError) {
                errorCount += dataRows.length;
                logSpreadsheetServiceError(
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

        return `${dataRows.length} updates in "${sheetName}"`;
    } catch (mainError) {
        logSpreadsheetServiceError(
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
 * @param sheetServiceInstance - Instance for sheet operations.
 * @param sheetName - Name of the sheet to update.
 * @param items - Array of items implementing ZwiftIdBase.
 * @param maxRowLimit - Maximum number of rows to process.
 */
export function updateSheetRowsByZwiftId<T extends ZwiftIdBase>(
    sheetServiceInstance: SpreadsheetService,
    sheetName: string,
    items: T[],
    maxRowLimit?: number
): string {
    sheetName = sheetName || "Squad";
    if (typeof maxRowLimit !== "number") {
        maxRowLimit = 1000;
    }

    try {
        ensureSheetExists(sheetServiceInstance, sheetName);

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
        sheetServiceInstance.updateRow(sheetName, 10, propertyNames);

        const zwiftIdDictionary = toZwiftIdDictionary(items);

        // check: Count of valid Zwift IDs in the dictionary merely for reporting purposes
        let validIdsInDictionary = 0;
        const keys = Object.keys(zwiftIdDictionary);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (isValidZwiftIdInCell(key)) {
                validIdsInDictionary++;
            }
        }

        const allSheetRows = sheetServiceInstance.getAllRows(sheetName);
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
                sheetServiceInstance.updateContiguousRows(sheetName, 11, updatedRows);
            } catch (setValuesError) {
                errorCount += updatedRows.length;
                logSpreadsheetServiceError(
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

        return `${overwriteCount} updates in "${sheetName}"`;
    } catch (mainError) {
        logSpreadsheetServiceError(
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