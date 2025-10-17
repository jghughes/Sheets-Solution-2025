// Sheets01\public\parsingFieldsUtils.js
/**
 * Lightweight parsing utilities used across models.
 * Exports ParseType enum and parse helpers, including a high-level parseField.
 *
 * All functions are purely functional and safe to unit-test independently.
 */

/**
 * Enum for parse types.
 * @readonly
 * @enum {string}
 */
export const ParseType = {
    STRING: "string",
    FLOAT: "float",
    INT: "int",
    BOOLEAN: "boolean",
    DATE: "date"
};

/**
 * Resolve a value from `rawJson` using `key` (string or array of alternative keys).
 * If no key is present returns `defaultValue`.
 *
 * @param {Object} rawJson - Source object to read from.
 * @param {string|string[]} key - Key name or array of alternative key names.
 * @param {*} defaultValue - Value to return when none of the keys exist.
 * @returns {*} The resolved value or `defaultValue`.
 */
export function resolveValue(rawJson, key, defaultValue) {
    let value = defaultValue;
    if (!rawJson || typeof rawJson !== "object") return value;

    if (Array.isArray(key)) {
        for (let k of key) {
            if (rawJson[k] != null) {
                value = rawJson[k];
                break;
            }
        }
    } else {
        if (rawJson[key] != null) {
            value = rawJson[key];
        }
    }
    return value;
}

/**
 * Parse value as string.
 * Accepts only actual strings; falls back to `defaultValue` (if string) or empty string.
 *
 * @param {*} value - Value to parse.
 * @param {string} defaultValue - Default string to return when parsing fails.
 * @returns {string} Parsed string or fallback.
 */
export function parseAsString(value, defaultValue) {
    if (typeof value !== "string") {
        return typeof defaultValue === "string" ? defaultValue : "";
    }
    return value.trim() !== "" ? value : (typeof defaultValue === "string" ? defaultValue : "");
}

/**
 * Parse value as floating point number.
 * Rejects objects/booleans and falls back to `defaultValue` (if number) or 0.0.
 *
 * @param {*} value - Value to parse.
 * @param {number} defaultValue - Default numeric fallback.
 * @returns {number} Parsed float or fallback.
 */
export function parseAsFloat(value, defaultValue) {
    if (typeof value === "object" || typeof value === "boolean") {
        return typeof defaultValue === "number" ? defaultValue : 0.0;
    }
    const parsed = parseFloat(value);
    return !isNaN(parsed) ? parsed : (typeof defaultValue === "number" ? defaultValue : 0.0);
}

/**
 * Parse value as integer.
 * Rejects objects/booleans and falls back to `defaultValue` (if number) or 0.
 *
 * @param {*} value - Value to parse.
 * @param {number} defaultValue - Default integer fallback.
 * @returns {number} Parsed integer or fallback.
 */
export function parseAsInt(value, defaultValue) {
    if (typeof value === "object" || typeof value === "boolean") {
        return typeof defaultValue === "number" ? defaultValue : 0;
    }
    const parsed = parseInt(value, 10);
    return !isNaN(parsed) ? parsed : (typeof defaultValue === "number" ? defaultValue : 0);
}

/**
 * Parse value as boolean.
 * Accepts boolean primitives, numeric values (0 => false, non-zero => true),
 * common truthy/falsey strings ("true","false","1","0","yes","no","on","off","y","n"),
 * and numeric strings.
 * Falls back to `defaultValue` (if boolean) or false.
 *
 * @param {*} value - Value to parse.
 * @param {boolean} defaultValue - Default boolean fallback.
 * @returns {boolean} Parsed boolean or fallback.
 */
export function parseAsBoolean(value, defaultValue) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
        const s = value.trim().toLowerCase();
        if (s === "") return typeof defaultValue === "boolean" ? defaultValue : false;
        if (["true", "1", "yes", "y", "on"].includes(s)) return true;
        if (["false", "0", "no", "n", "off"].includes(s)) return false;
        if (/^-?\d+$/.test(s)) return Number(s) !== 0;
        return typeof defaultValue === "boolean" ? defaultValue : false;
    }
    return typeof defaultValue === "boolean" ? defaultValue : false;
}

/**
 * Convert a numeric timestamp-like value to a Date.
 * Heuristics:
 * - |n| > 1e14 => treat as .NET ticks (100-ns since 0001-01-01) and convert:
 *     ms = (ticks - 621355968000000000) / 10000
 * - |n| < 1e11 => treat as Unix seconds and convert to milliseconds
 * - otherwise treat as milliseconds
 *
 * @param {number} n - Numeric timestamp, ticks, seconds or milliseconds.
 * @returns {Date|null} Date instance or null if input invalid.
 */
export function numericToDate(n) {
    if (typeof n !== "number" || !isFinite(n)) return null;
    const abs = Math.abs(n);

    // .NET ticks -> ms
    if (abs > 1e14) {
        const msFromTicks = Math.floor((n - 621355968000000000) / 10000);
        return new Date(msFromTicks);
    }

    // seconds -> ms
    if (abs < 1e11) {
        return new Date(Math.floor(n * 1000));
    }

    // treat as milliseconds
    return new Date(Math.floor(n));
}

/**
 * Parse value as Date.
 * Supported inputs:
 * - Date instance (returned as-is)
 * - number: seconds, milliseconds, or .NET ticks (heuristic)
 * - numeric string: same as number
 * - Microsoft JSON wrapper '/Date(<num>[+zzzz])/' where <num> is ms or ticks
 * - ISO 8601 / RFC3339 strings (many common variants). Normalizes timezone offsets without colon.
 * - Falls back to Date.parse() for permissive parsing before returning default.
 *
 * @param {*} value - Value to parse into a Date.
 * @param {Date|null} defaultValue - Default Date to return when parsing fails (if instance of Date) else null.
 * @returns {Date|null} Parsed Date or `defaultValue`/null.
 */
export function parseAsDate(value, defaultValue) {
    let dateObj = null;
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?(?:Z|[+-]\d{2}:\d{2}|[+-]\d{4})?$/;

    if (typeof value === "number") {
        dateObj = numericToDate(value);
    } else if (typeof value === "string") {
        const trimmed = value.trim();

        // MS JSON wrapper: /Date(<num>)/ optionally with timezone
        const msWrapperMatch = /^\/Date\((-?\d+)(?:[+-]\d{4})?\)\/$/.exec(trimmed);
        if (msWrapperMatch) {
            dateObj = numericToDate(Number(msWrapperMatch[1]));
        }
        // pure numeric string (seconds, ms, or ticks)
        else if (/^-?\d+$/.test(trimmed)) {
            dateObj = numericToDate(Number(trimmed));
        }
        // likely ISO-ish
        else if (iso8601Regex.test(trimmed)) {
            // Normalize timezone offset without colon (e.g. +0200 -> +02:00)
            const normalized = trimmed.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
            dateObj = new Date(normalized);

            // Fallback to Date.parse for variants not covered by the regex
            if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
                const parsed = Date.parse(trimmed);
                if (!isNaN(parsed)) dateObj = new Date(parsed);
            }
        } else {
            // permissive fallback
            const parsedFallback = Date.parse(trimmed);
            if (!isNaN(parsedFallback)) {
                dateObj = new Date(parsedFallback);
            } else {
                return defaultValue instanceof Date ? defaultValue : null;
            }
        }
    } else if (value instanceof Date) {
        dateObj = value;
    } else {
        return defaultValue instanceof Date ? defaultValue : null;
    }

    if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
        return dateObj;
    }
    return defaultValue instanceof Date ? defaultValue : null;
}

/**
 * Central parse function delegating to type-specific helpers.
 *
 * @param {Object} rawJson - Source object.
 * @param {string|string[]} key - Key or array of alternative keys.
 * @param {ParseType} type - Desired ParseType.
 * @param {*} defaultValue - Default value returned when parsing fails or key missing.
 * @returns {string|number|boolean|Date|null} Parsed value or fallback.
 */
export function parseField(rawJson, key, type, defaultValue) {
    const valueToParse = resolveValue(rawJson, key, defaultValue);

    if (type === ParseType.STRING) return parseAsString(valueToParse, defaultValue);
    if (type === ParseType.FLOAT) return parseAsFloat(valueToParse, defaultValue);
    if (type === ParseType.INT) return parseAsInt(valueToParse, defaultValue);
    if (type === ParseType.BOOLEAN) return parseAsBoolean(valueToParse, defaultValue);
    if (type === ParseType.DATE) return parseAsDate(valueToParse, defaultValue);

    // Unknown type, return null
    return null;
}