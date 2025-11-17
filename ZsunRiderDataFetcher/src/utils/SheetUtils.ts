import {
    serverErrorCode,
    throwServerErrorWithContext,
} from "./ErrorUtils";
import { logEvent, LogLevel } from "./Logger";
import { RiderStatsDisplayItem } from "../models/RiderStatsDisplayItem";
import { RiderStatsItem } from "../models/RiderStatsItem";
import { ISheetApi } from "./SheetApi";
import toDisplayItemDictionary = RiderStatsItem.toDisplayItemDictionary;


/**
 * Writes rider stats data to a specified sheet.
 * @param sheetApi - Abstraction for sheet operations.
 * @param sheetName - Name of the sheet to write to.
 * @param records - Array of RiderStatsDisplayItem to write.
 */
export function writeAllRecordsToSheet(
    sheetApi: ISheetApi,
    sheetName: string,
    records: RiderStatsDisplayItem[],
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
        const data: any[] = [];
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

        // Write all data rows in bulk if possible
        if (data.length > 0) {
            try {
                sheetApi.setValues(sheetName, 2, 1, data.length, keys.length, data);
            } catch (setValuesErr) {
                errorCount += data.length;
                logEvent({
                    message: `API error during setValues in writeAllRecordsToSheet`,
                    level: LogLevel.ERROR,
                    exception: setValuesErr,
                    extraFields: {
                        sheetName,
                        operation: "setValues",
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
            "setValues",
            { sheetName }
        );
    }
}

/**
 * Updates the "Squad" sheet with rider stats display items.
 * Overwrites rows where the first cell matches a zwiftId in the displayItems.
 * @param sheetApi - Abstraction for sheet operations.
 * @param sheetName - Name of the sheet to update.
 * @param displayItems - Array of RiderStatsDisplayItem from which to select to write.
 */
export function writeItemisedRecordsToSheet(
    sheetApi: ISheetApi,
    sheetName: string,
    displayItems: RiderStatsDisplayItem[]
): void {
    // Get keys from the first record
    const keys = Object.keys(displayItems[0] || {});
    // Overwrite top row with fresh headings
    sheetApi.updateRow(sheetName, 0, keys);

    // Convert displayItems to dictionary for fast lookup by zwiftId
    const dict = RiderStatsItem.toDisplayItemDictionary(displayItems);

    let overwriteCount = 0;
    let errorCount = 0;

    for (let rowIdx = 1; rowIdx <= 700; rowIdx++) {
        let row: any[] | null, cellValue: any;
        try {
            row = sheetApi.getRow(sheetName, rowIdx);
            cellValue = row && row[0];
        } catch (getRowErr) {
            errorCount++;
            logEvent({
                message: `API error during getRow in writeItemisedRecordsToSheet`,
                level: LogLevel.ERROR,
                exception: getRowErr,
                extraFields: {
                    sheetName,
                    rowIdx,
                    operation: "getRow",
                    errorType: getRowErr?.code || getRowErr?.name,
                    errorMessage: getRowErr?.message || String(getRowErr)
                }
            });
            continue;
        }

        if (!cellValue || typeof cellValue !== "string" || !(cellValue in dict)) continue;

        try {
            const record = dict[cellValue];
            const newRow = keys.map(k => record[k]);
            sheetApi.updateRow(sheetName, rowIdx, newRow);
            overwriteCount++;
        } catch (updateRowErr) {
            errorCount++;
            logEvent({
                message: `API error during updateRow in writeItemisedRecordsToSheet`,
                level: LogLevel.ERROR,
                exception: updateRowErr,
                extraFields: {
                    sheetName,
                    rowIdx,
                    operation: "updateRow",
                    errorType: updateRowErr?.code || updateRowErr?.name,
                    errorMessage: updateRowErr?.message || String(updateRowErr)
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
            errorCount
        }
    });
}


