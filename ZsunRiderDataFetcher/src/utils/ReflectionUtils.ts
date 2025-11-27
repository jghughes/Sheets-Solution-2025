import { ZwiftIdBase } from "../models/ZwiftIdBase";

/**
 * Gets property names from the first record, moving zwiftId to the front if present.
 * @param records - Array of items implementing IHasZwiftId.
 */
export function getPropertyNames<T extends ZwiftIdBase>(records: T[]): string[] {
    if (!records || records.length === 0 || typeof records[0] !== "object" || records[0] === null) return [];
    const propertyNames = Object.keys(records[0]);
    const zwiftIdIndex = propertyNames.indexOf("zwiftId");
    if (zwiftIdIndex > 0) {
        propertyNames.splice(zwiftIdIndex, 1);
        propertyNames.unshift("zwiftId");
    }
    return propertyNames;
}