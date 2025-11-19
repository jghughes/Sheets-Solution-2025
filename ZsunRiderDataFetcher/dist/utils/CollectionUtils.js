"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toZwiftIdDictionary = toZwiftIdDictionary;
/**
 * Converts an array of items implementing IHasZwiftId into a dictionary keyed by zwiftId.
 *
 * @param items Array of objects that implement IHasZwiftId.
 * @returns Dictionary object where each key is the zwiftId and the value is the corresponding item.
 */
function toZwiftIdDictionary(items) {
    const dict = {};
    if (!Array.isArray(items))
        return dict;
    for (const item of items) {
        if (item && typeof item.zwiftId === "string" && item.zwiftId.length > 0) {
            dict[item.zwiftId] = item;
        }
    }
    return dict;
}
//# sourceMappingURL=CollectionUtils.js.map