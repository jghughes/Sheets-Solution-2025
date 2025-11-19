import { SheetApi } from "./SheetApi";
import { IHasZwiftId } from "../interfaces/IHasZwiftId";
/**
 * Writes an array of items implementing IHasZwiftId to a specified sheet.
 * @param sheetApi - Instance for sheet operations.
 * @param sheetName - Name of the sheet to write to.
 * @param records - Array of items implementing IHasZwiftId.
 */
export declare function writeSheetRowsByZwiftId<T extends IHasZwiftId>(sheetApi: SheetApi, sheetName: string, records: T[]): void;
/**
 * Updates the specified sheet with items implementing IHasZwiftId.
 * Overwrites rows where the first cell matches a zwiftId in the items.
 * Uses batch update for efficiency.
 * @param sheetApi - Instance for sheet operations.
 * @param sheetName - Name of the sheet to update.
 * @param items - Array of items implementing IHasZwiftId.
 * @param maxRowLimit - Maximum number of rows to process.
 */
export declare function updateSheetRowsByZwiftId<T extends IHasZwiftId>(sheetApi: SheetApi, sheetName: string, items: T[], maxRowLimit?: number): void;
//# sourceMappingURL=SheetRowUtils.d.ts.map