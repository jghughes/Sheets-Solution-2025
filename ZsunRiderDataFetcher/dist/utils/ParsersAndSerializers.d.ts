export type ParseType = {
    stringType: string;
    floatType: string;
    intType: string;
    booleanType: string;
    dateType: string;
};
export declare const parseType: ParseType;
/**
 * Parses a field from a JSON object using an array of possible field aliases.
 *
 * @param rawJson - The JSON object to extract the value from.
 * @param fieldAliases - An array of strings representing possible property names (aliases).
 * @param type - The expected type of the value.
 * @param defaultValue - The value to return if no valid property is found.
 * @returns The parsed value, or `defaultValue` if not found or invalid.
 */
export declare function parseField(rawJson: string, fieldAliases: string[], type: string, defaultValue: string | number | boolean | Date): string | number | boolean | Date | null;
/**
 * Safely retrieves a value from a JSON object using one or more possible
 * field aliases for the underlying property.
 *
 * - Checks each alias in the array in order and returns the first valid value found.
 * - If no valid value is found, returns `defaultValue`.
 *
 * @param rawJson - The object to extract the value from.
 * @param fieldAliases - An array of strings representing possible property names (aliases).
 * @param defaultValue - The value to return if no valid property is found.
 * @returns The extracted value, or `defaultValue` if not found or invalid.
 *
 * @example
 * const json = { user_id: 42, name: "Alice" };
 * const value = getJsonFieldValueByFieldAliases(json, ["userid", "user_id", "id"], 0);
 * // value === 42
 */
export declare function getJsonFieldValueByFieldAliases(rawJson: any, fieldAliases: string[], defaultValue: any): any;
export declare function parseAsString(value: any, defaultValue: string): string;
export declare function parseAsFloat(value: any, defaultValue: number): number;
export declare function parseAsInt(value: any, defaultValue: number): number;
export declare function parseAsBoolean(value: any, defaultValue: boolean): boolean;
export declare function fromDotNetTicks(ticks: number | string): Date;
export declare function numericToDate(n: number): Date;
export declare function parseAsDate(value: any, defaultValue: Date): Date;
//# sourceMappingURL=ParsersAndSerializers.d.ts.map