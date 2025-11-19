import { IHasZwiftId } from "../interfaces/IHasZwiftId";
/**
 * Converts an array of items implementing IHasZwiftId into a dictionary keyed by zwiftId.
 *
 * @param items Array of objects that implement IHasZwiftId.
 * @returns Dictionary object where each key is the zwiftId and the value is the corresponding item.
 */
export declare function toZwiftIdDictionary<T extends IHasZwiftId>(items: T[]): {
    [zwiftId: string]: T;
};
//# sourceMappingURL=CollectionUtils.d.ts.map