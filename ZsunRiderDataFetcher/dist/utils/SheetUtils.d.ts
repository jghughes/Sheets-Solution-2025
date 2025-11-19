import { RiderStatsDisplayItem } from "../models/RiderStatsDisplayItem";
import { SheetApi } from "./SheetApi";
/**
 * Writes rider stats data to a specified sheet.
 * @param sheetApi - Instance for sheet operations.
 * @param sheetName - Name of the sheet to write to.
 * @param records - Array of RiderStatsDisplayItem to write.
 */
export declare function writeAllRecordsToSheet(sheetApi: SheetApi, sheetName: string, records: RiderStatsDisplayItem[]): void;
/**
 * Updates the "Squad" sheet with rider stats display items.
 * Overwrites rows where the first cell matches a zwiftId in the displayItems.
 * Uses batch update for efficiency.
 * @param sheetApi - Instance for sheet operations.
 * @param sheetName - Name of the sheet to update.
 * @param displayItems - Array of RiderStatsDisplayItem from which to select to write.
 */
export declare function writeItemisedRecordsToSheet(sheetApi: SheetApi, sheetName: string, displayItems: RiderStatsDisplayItem[], maxRowLimit?: number): void;
//# sourceMappingURL=SheetUtils.d.ts.map