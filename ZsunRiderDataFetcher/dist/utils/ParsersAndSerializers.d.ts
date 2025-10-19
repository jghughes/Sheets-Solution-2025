/**
 * Lightweight parsing utilities used across models.
 * Exports ParseType enum and parse helpers, including a high-level parseField.
 *
 * All functions are purely functional and safe to unit-test independently.
 */
/**
 * Enum for parse types.
 */
export declare enum ParseType {
    STRING = "string",
    FLOAT = "float",
    INT = "int",
    BOOLEAN = "boolean",
    DATE = "date"
}
/**
 * Resolve a value from `rawJson` using `key` (string or array of alternative keys).
 * If no key is present returns `defaultValue`.
 */
export declare function resolveValue<T>(rawJson: Record<string, any> | null | undefined, key: string | string[], defaultValue: T): T;
/**
 * Parse value as string.
 * Accepts only actual strings; falls back to `defaultValue` (if string) or empty string.
 */
export declare function parseAsString(value: unknown, defaultValue?: string): string;
/**
 * Parse value as floating point number.
 * Rejects objects/booleans and falls back to `defaultValue` (if number) or 0.0.
 */
export declare function parseAsFloat(value: unknown, defaultValue?: number): number;
/**
 * Parse value as integer.
 * Rejects objects/booleans and falls back to `defaultValue` (if number) or 0.
 */
export declare function parseAsInt(value: unknown, defaultValue?: number): number;
/**
 * Parse value as boolean.
 * Accepts boolean primitives, numeric values (0 => false, non-zero => true),
 * common truthy/falsey strings ("true","false","1","0","yes","no","on","off","y","n"),
 * and numeric strings.
 * Falls back to `defaultValue` (if boolean) or false.
 */
export declare function parseAsBoolean(value: unknown, defaultValue?: boolean): boolean;
/**
 * Convert .NET ticks (100-ns intervals since 0001-01-01) to a Date.
 * .NET ticks are the number of 100-nanosecond intervals since 0001-01-01T00:00:00.
 * Conversion:
 *   ms = Math.floor((ticks - 621355968000000000) / 10000)
 *
 * Accepts numeric strings as well as numbers. Returns null for invalid inputs.
 */
export declare function fromDotNetTicks(ticks: number | string): Date | null;
/**
 * Convert a numeric timestamp-like value to a Date.
 * Heuristics:
 * - |n| > 1e14 => treat as .NET ticks (calls `fromDotNetTicks`)
 * - |n| < 1e11 => treat as Unix seconds and convert to milliseconds
 * - otherwise treat as milliseconds
 */
export declare function numericToDate(n: number): Date | null;
/**
 * Parse value as Date.
 * Supported inputs:
 * - Date instance (returned as-is)
 * - number: seconds, milliseconds, or .NET ticks (heuristic)
 * - numeric string: same as number
 * - Microsoft JSON wrapper '/Date(<num>[+zzzz])/' where <num> is ms or ticks
 * - ISO 8601 / RFC3339 strings (many common variants). Normalizes timezone offsets without colon.
 * - Falls back to Date.parse() for permissive parsing before returning default.
 */
export declare function parseAsDate(value: unknown, defaultValue?: Date | null): Date | null;
/**
 * Serialize a string-like value. Mirrors parseAsString trimming/empty fallback.
 */
export declare function serializeString(value: unknown, defaultValue?: string): string;
/**
 * Serialize a float-like value.
 * - If already a number, returns it
 * - If null/empty returns `defaultValue` (or 0)
 * - Otherwise attempts numeric coercion via parseAsFloat
 */
export declare function serializeFloat(value: unknown, defaultValue?: number): number;
/**
 * Serialize an integer-like value.
 * - If already a number, returns it
 * - If null/empty returns `defaultValue` (or 0)
 * - Otherwise attempts integer coercion via parseAsInt
 */
export declare function serializeInt(value: unknown, defaultValue?: number): number;
/**
 * Serialize a date-like value into an ISO string or null.
 * - If input is Date, returns toISOString()
 * - If input can be parsed into Date, returns ISO
 * - Otherwise returns existing string value or null
 */
export declare function serializeDate(value: unknown): string | null;
/**
 * Central serialize function delegating to type-specific helpers.
 *
 * Usage: serializeType(value, ParseType.FLOAT, 0)
 */
export declare function serializeType(value: unknown, type: ParseType, defaultValue?: unknown): string | number | boolean | null;
/**
 * Central parse function delegating to type-specific helpers.
 */
export declare function parseField(rawJson: Record<string, any> | null | undefined, key: string | string[], type: ParseType, defaultValue?: unknown): string | number | boolean | Date | null;
//# sourceMappingURL=ParsersAndSerializers.d.ts.map