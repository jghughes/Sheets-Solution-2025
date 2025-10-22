/**
 * Miscellaneous utility helpers used across the project.
 * Keep functions small and pure where possible.
 */
/**
 * This function is useful for validating that a parsed JSON object is a dictionary (object with string keys)
 * where each value is itself an object (not a primitive or array).
 * Returns false for null, non-objects, or arrays.
 */
export declare function isDictionaryOfObjects(obj: any): obj is Record<string, Record<string, any>>;
/**
 * Checks if the given value is a plain object (not null, not an array)
 * and has no own enumerable properties (i.e., is an empty dictionary).
 */
export declare function isEmptyDictionary(obj: any): obj is Record<string, never>;
/**
 * Converts a dictionary (object with string keys and T values) to an array of T values.
 *
 * @template T - The type of the dictionary's values.
 * @param dict - The dictionary to convert. If null, undefined, not an object, or an array, returns an empty array.
 * @returns An array of the dictionary's values, or an empty array if input is invalid or empty.
 *
 * @example
 *   dictionaryToArray({ a: 1, b: 2 }); // [1, 2]
 *   dictionaryToArray(null); // []
 *   dictionaryToArray({}); // []
 */
export declare function dictionaryToArray<T>(dict: {
    [key: string]: T;
} | null | undefined): T[];
/**
 * Pause for the specified number of milliseconds.
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Clamp a number between min and max (inclusive).
 */
export declare function clamp(value: number, min: number, max: number): number;
export declare function uniqueId(prefix?: string): string;
/**
 * Chunk an array into pieces of the provided size.
 */
export declare function chunkArray<T>(arr: T[], size: number): T[][];
/**
 * Try parse JSON safely. Returns fallback if parsing fails.
 */
/**
 * Retry an async function with a delay between attempts.
 * shouldRetry receives the error and current attempt index (1-based).
 */
export declare function retryAsync<T>(fn: () => Promise<T>, attempts?: number, delayMs?: number, shouldRetry?: (err: any, attempt: number) => boolean): Promise<T>;
/**
 * Pick specific keys from an object.
 */
/**
 * Omit specific keys from an object.
 */
/**
 * Format a Date to an ISO string without milliseconds (YYYY-MM-DDTHH:mm:ssZ).
 */
export declare function formatIsoDateNoMs(date: Date): string;
/**
 * Convert an object to a query string. Skips undefined and null.
 */
/**
 * Parse a query string into an object. Values are strings or string[].
 */
export declare function parseQueryString(qs: string): Record<string, string | string[]>;
/**
 * Ensure the value is an array. If null/undefined return empty array.
 */
export declare function ensureArray<T>(value: T | T[] | null | undefined): T[];
/**
 * Capitalize the first character of the string. Returns empty string as-is.
 */
export declare function capitalize(s: string): string;
/**
 * Simple null/undefined check.
 */
export declare function isNullOrUndefined(value: any): value is null | undefined;
//# sourceMappingURL=miscellaneousUtils.d.ts.map