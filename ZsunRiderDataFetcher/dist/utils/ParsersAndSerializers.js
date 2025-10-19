"use strict";
/**
 * Lightweight parsing utilities used across models.
 * Exports ParseType enum and parse helpers, including a high-level parseField.
 *
 * All functions are purely functional and safe to unit-test independently.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseType = void 0;
exports.resolveValue = resolveValue;
exports.parseAsString = parseAsString;
exports.parseAsFloat = parseAsFloat;
exports.parseAsInt = parseAsInt;
exports.parseAsBoolean = parseAsBoolean;
exports.fromDotNetTicks = fromDotNetTicks;
exports.numericToDate = numericToDate;
exports.parseAsDate = parseAsDate;
exports.serializeString = serializeString;
exports.serializeFloat = serializeFloat;
exports.serializeInt = serializeInt;
exports.serializeDate = serializeDate;
exports.serializeType = serializeType;
exports.parseField = parseField;
/**
 * Enum for parse types.
 */
var ParseType;
(function (ParseType) {
    ParseType["STRING"] = "string";
    ParseType["FLOAT"] = "float";
    ParseType["INT"] = "int";
    ParseType["BOOLEAN"] = "boolean";
    ParseType["DATE"] = "date";
})(ParseType || (exports.ParseType = ParseType = {}));
/**
 * Resolve a value from `rawJson` using `key` (string or array of alternative keys).
 * If no key is present returns `defaultValue`.
 */
function resolveValue(rawJson, key, defaultValue) {
    if (!rawJson || typeof rawJson !== "object")
        return defaultValue;
    if (Array.isArray(key)) {
        for (const k of key) {
            const v = rawJson[k];
            if (v != null)
                return v;
        }
        return defaultValue;
    }
    return rawJson[key] != null ? rawJson[key] : defaultValue;
}
/**
 * Parse value as string.
 * Accepts only actual strings; falls back to `defaultValue` (if string) or empty string.
 */
function parseAsString(value, defaultValue) {
    if (typeof value !== "string") {
        return typeof defaultValue === "string" ? defaultValue : "";
    }
    const trimmed = value.trim();
    return trimmed !== "" ? trimmed : (typeof defaultValue === "string" ? defaultValue : "");
}
/**
 * Parse value as floating point number.
 * Rejects objects/booleans and falls back to `defaultValue` (if number) or 0.0.
 */
function parseAsFloat(value, defaultValue) {
    if (typeof value === "object" || typeof value === "boolean") {
        return typeof defaultValue === "number" ? defaultValue : 0.0;
    }
    if (value === "" || value == null) {
        return typeof defaultValue === "number" ? defaultValue : 0.0;
    }
    const num = Number(value);
    return Number.isFinite(num) ? num : (typeof defaultValue === "number" ? defaultValue : 0.0);
}
/**
 * Parse value as integer.
 * Rejects objects/booleans and falls back to `defaultValue` (if number) or 0.
 */
function parseAsInt(value, defaultValue) {
    if (typeof value === "object" || typeof value === "boolean") {
        return typeof defaultValue === "number" ? defaultValue : 0;
    }
    if (value === "" || value == null) {
        return typeof defaultValue === "number" ? defaultValue : 0;
    }
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : (typeof defaultValue === "number" ? defaultValue : 0);
}
/**
 * Parse value as boolean.
 * Accepts boolean primitives, numeric values (0 => false, non-zero => true),
 * common truthy/falsey strings ("true","false","1","0","yes","no","on","off","y","n"),
 * and numeric strings.
 * Falls back to `defaultValue` (if boolean) or false.
 */
function parseAsBoolean(value, defaultValue) {
    if (typeof value === "boolean")
        return value;
    if (typeof value === "number")
        return value !== 0;
    if (typeof value === "string") {
        const s = value.trim().toLowerCase();
        if (s === "")
            return typeof defaultValue === "boolean" ? defaultValue : false;
        if (["true", "1", "yes", "y", "on"].includes(s))
            return true;
        if (["false", "0", "no", "n", "off"].includes(s))
            return false;
        if (/^-?\d+$/.test(s))
            return Number(s) !== 0;
        return typeof defaultValue === "boolean" ? defaultValue : false;
    }
    return typeof defaultValue === "boolean" ? defaultValue : false;
}
/**
 * Convert .NET ticks (100-ns intervals since 0001-01-01) to a Date.
 * .NET ticks are the number of 100-nanosecond intervals since 0001-01-01T00:00:00.
 * Conversion:
 *   ms = Math.floor((ticks - 621355968000000000) / 10000)
 *
 * Accepts numeric strings as well as numbers. Returns null for invalid inputs.
 */
function fromDotNetTicks(ticks) {
    const DOTNET_TICKS_AT_UNIX_EPOCH = 621355968000000000;
    const num = typeof ticks === "string" ? Number(ticks) : ticks;
    if (!Number.isFinite(num))
        return null;
    const ms = Math.floor((num - DOTNET_TICKS_AT_UNIX_EPOCH) / 10000);
    return new Date(ms);
}
/**
 * Convert a numeric timestamp-like value to a Date.
 * Heuristics:
 * - |n| > 1e14 => treat as .NET ticks (calls `fromDotNetTicks`)
 * - |n| < 1e11 => treat as Unix seconds and convert to milliseconds
 * - otherwise treat as milliseconds
 */
function numericToDate(n) {
    if (!Number.isFinite(n))
        return null;
    const abs = Math.abs(n);
    if (abs > 1e14) {
        return fromDotNetTicks(n);
    }
    if (abs < 1e11) {
        return new Date(Math.floor(n * 1000));
    }
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
 */
function parseAsDate(value, defaultValue = null) {
    let dateObj = null;
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?(?:Z|[+-]\d{2}:\d{2}|[+-]\d{4})?$/;
    if (value instanceof Date) {
        dateObj = value;
    }
    else if (typeof value === "number") {
        dateObj = numericToDate(value);
    }
    else if (typeof value === "string") {
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
                if (!isNaN(parsed))
                    dateObj = new Date(parsed);
            }
        }
        else {
            // permissive fallback
            const parsedFallback = Date.parse(trimmed);
            if (!isNaN(parsedFallback)) {
                dateObj = new Date(parsedFallback);
            }
            else {
                return defaultValue instanceof Date ? defaultValue : null;
            }
        }
    }
    else {
        return defaultValue instanceof Date ? defaultValue : null;
    }
    if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
        return dateObj;
    }
    return defaultValue instanceof Date ? defaultValue : null;
}
/**
 * Serialize a string-like value. Mirrors parseAsString trimming/empty fallback.
 */
function serializeString(value, defaultValue) {
    return parseAsString(value, defaultValue);
}
/**
 * Serialize a float-like value.
 * - If already a number, returns it
 * - If null/empty returns `defaultValue` (or 0)
 * - Otherwise attempts numeric coercion via parseAsFloat
 */
function serializeFloat(value, defaultValue) {
    if (typeof value === "number")
        return value;
    if (value == null || value === "")
        return typeof defaultValue === "number" ? defaultValue : 0;
    return parseAsFloat(value, typeof defaultValue === "number" ? defaultValue : 0);
}
/**
 * Serialize an integer-like value.
 * - If already a number, returns it
 * - If null/empty returns `defaultValue` (or 0)
 * - Otherwise attempts integer coercion via parseAsInt
 */
function serializeInt(value, defaultValue) {
    if (typeof value === "number")
        return value;
    if (value == null || value === "")
        return typeof defaultValue === "number" ? defaultValue : 0;
    return parseAsInt(value, typeof defaultValue === "number" ? defaultValue : 0);
}
/**
 * Serialize a date-like value into an ISO string or null.
 * - If input is Date, returns toISOString()
 * - If input can be parsed into Date, returns ISO
 * - Otherwise returns existing string value or null
 */
function serializeDate(value) {
    if (value instanceof Date)
        return value.toISOString();
    const parsed = parseAsDate(value, null);
    if (parsed instanceof Date)
        return parsed.toISOString();
    return typeof value === "string" ? value : null;
}
/**
 * Central serialize function delegating to type-specific helpers.
 *
 * Usage: serializeType(value, ParseType.FLOAT, 0)
 */
function serializeType(value, type, defaultValue) {
    if (type === ParseType.STRING)
        return serializeString(value, defaultValue);
    if (type === ParseType.FLOAT)
        return serializeFloat(value, defaultValue);
    if (type === ParseType.INT)
        return serializeInt(value, defaultValue);
    if (type === ParseType.DATE)
        return serializeDate(value);
    if (type === ParseType.BOOLEAN) {
        // boolean serialization: try parseAsBoolean so strings/numbers are handled; preserve default if invalid
        return parseAsBoolean(value, typeof defaultValue === "boolean" ? defaultValue : false);
    }
    return null;
}
/**
 * Central parse function delegating to type-specific helpers.
 */
function parseField(rawJson, key, type, defaultValue) {
    const valueToParse = resolveValue(rawJson, key, defaultValue);
    if (type === ParseType.STRING)
        return parseAsString(valueToParse, defaultValue);
    if (type === ParseType.FLOAT)
        return parseAsFloat(valueToParse, defaultValue);
    if (type === ParseType.INT)
        return parseAsInt(valueToParse, defaultValue);
    if (type === ParseType.BOOLEAN)
        return parseAsBoolean(valueToParse, defaultValue);
    if (type === ParseType.DATE)
        return parseAsDate(valueToParse, defaultValue);
    // Unknown type, return null
    return null;
}
//# sourceMappingURL=ParsersAndSerializers.js.map