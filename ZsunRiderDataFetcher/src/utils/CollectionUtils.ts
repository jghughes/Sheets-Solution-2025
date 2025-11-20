import { ZwiftIdBase } from "../models/ZwiftIdBase";

/**
 * Converts an array of items extending ZwiftIdBase into a dictionary keyed by zwiftId.
 *
 * @param items Array of objects that extend ZwiftIdBase.
 * @returns Dictionary object where each key is the zwiftId and the value is the corresponding item.
 */
export function toZwiftIdDictionary<T extends ZwiftIdBase>(items: T[]): { [zwiftId: string]: T } {
    const dict: { [zwiftId: string]: T } = {};
    if (!Array.isArray(items)) return dict;
    for (const item of items) {
        if (item && typeof item.zwiftId === "string" && item.zwiftId.length > 0) {
            dict[item.zwiftId] = item;
        }
    }
    return dict;
}       