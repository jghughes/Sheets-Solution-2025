"use strict";
/**
 * Miscellaneous utility helpers used across the project.
 * Keep functions small and pure where possible.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDictionaryOfObjects = isDictionaryOfObjects;
exports.isEmptyDictionary = isEmptyDictionary;
exports.dictionaryToArray = dictionaryToArray;
exports.sleep = sleep;
exports.clamp = clamp;
exports.uniqueId = uniqueId;
exports.chunkArray = chunkArray;
exports.retryAsync = retryAsync;
exports.formatIsoDateNoMs = formatIsoDateNoMs;
exports.parseQueryString = parseQueryString;
exports.ensureArray = ensureArray;
exports.capitalize = capitalize;
exports.isNullOrUndefined = isNullOrUndefined;
/**
 * This function is useful for validating that a parsed JSON object is a dictionary (object with string keys)
 * where each value is itself an object (not a primitive or array).
 * Returns false for null, non-objects, or arrays.
 */
function isDictionaryOfObjects(obj) {
    if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
        return false;
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (typeof value !== "object" ||
                value === null ||
                Array.isArray(value)) {
                return false;
            }
        }
    }
    return true;
}
/**
 * Checks if the given value is a plain object (not null, not an array)
 * and has no own enumerable properties (i.e., is an empty dictionary).
 */
function isEmptyDictionary(obj) {
    return obj !== null &&
        typeof obj === "object" &&
        !Array.isArray(obj) &&
        Object.keys(obj).length === 0;
}
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
function dictionaryToArray(dict) {
    if (dict === null || dict === undefined || typeof dict !== "object" || Array.isArray(dict)) {
        return [];
    }
    return Object.keys(dict).map(key => dict[key]);
}
/**
 * Pause for the specified number of milliseconds.
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Clamp a number between min and max (inclusive).
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
/**
 * Generate a short unique id. Uses a counter plus timestamp.
 */
let _uidCounter = 0;
function uniqueId(prefix = '') {
    _uidCounter = (_uidCounter + 1) & 0xffff;
    const ts = Date.now().toString(36);
    const ctr = _uidCounter.toString(36);
    return `${prefix}${ts}${ctr}`;
}
/**
 * Chunk an array into pieces of the provided size.
 */
function chunkArray(arr, size) {
    if (size <= 0)
        throw new Error('size must be > 0');
    const out = [];
    for (let i = 0; i < arr.length; i += size) {
        out.push(arr.slice(i, i + size));
    }
    return out;
}
/**
 * Deep clone a value. Uses structuredClone if available, else JSON fallback.
 * Note: JSON fallback loses functions, undefined, and non-JSON-safe values.
 */
//export function deepClone<T>(value: T): T {
//  // @ts-ignore - structuredClone may not exist in all runtimes
//  if (typeof globalThis !== 'undefined' && typeof (globalThis as any).structuredClone === 'function') {
//    // @ts-ignore
//    return (globalThis as any).structuredClone(value);
//  }
//  return JSON.parse(JSON.stringify(value)) as T;
//}
/**
 * Merge objects deeply. Arrays are replaced, not merged.
 */
//export function mergeDeep<T extends AnyObject>(target: T, ...sources: AnyObject[]): T {
//  if (!sources.length) return target;
//  const src = sources.shift()!;
//  if (isObject(target) && isObject(src)) {
//    for (const key of Object.keys(src)) {
//      const val = src[key];
//      if (isObject(val)) {
//        if (!(key in target)) (target as any)[key] = {};
//        mergeDeep((target as any)[key], val);
//      } else {
//        (target as any)[key] = val;
//      }
//    }
//  }
//  return mergeDeep(target, ...sources);
//}
function isObject(item) {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
}
/**
 * Try parse JSON safely. Returns fallback if parsing fails.
 */
//export function safeParseJSON<T = any>(text: string, fallback: T | null = null): T | null {
//  try {
//    return JSON.parse(text) as T;
//  } catch {
//    return fallback;
//  }
//}
/**
 * Retry an async function with a delay between attempts.
 * shouldRetry receives the error and current attempt index (1-based).
 */
async function retryAsync(fn, attempts = 3, delayMs = 500, shouldRetry = () => true) {
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await fn();
        }
        catch (err) {
            lastError = err;
            if (attempt >= attempts || !shouldRetry(err, attempt))
                break;
            await sleep(delayMs);
        }
    }
    throw lastError;
}
/**
 * Pick specific keys from an object.
 */
//export function pick<T extends AnyObject, K extends keyof T>(obj: T, keys: K[]): Partial<T> {
//  const out: Partial<T> = {};
//  for (const k of keys) {
//    if (k in obj) out[k] = obj[k];
//  }
//  return out;
//}
/**
 * Omit specific keys from an object.
 */
//export function omit<T extends AnyObject, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
//  const out = { ...obj } as AnyObject;
//  for (const k of keys) {
//    delete out[k as string];
//  }
//  return out as Omit<T, K>;
//}
/**
 * Format a Date to an ISO string without milliseconds (YYYY-MM-DDTHH:mm:ssZ).
 */
function formatIsoDateNoMs(date) {
    return new Date(date.getTime() - (date.getTime() % 1000)).toISOString();
}
/**
 * Convert an object to a query string. Skips undefined and null.
 */
//export function toQueryString(params: AnyObject = {}): string {
//  const parts: string[] = [];
//  for (const [k, v] of Object.entries(params)) {
//    if (v === undefined || v === null) continue;
//    if (Array.isArray(v)) {
//      for (const item of v) parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(item))}`);
//    } else {
//      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
//    }
//  }
//  return parts.length ? `?${parts.join('&')}` : '';
//}
/**
 * Parse a query string into an object. Values are strings or string[].
 */
function parseQueryString(qs) {
    const s = qs.startsWith('?') ? qs.slice(1) : qs;
    const out = {};
    if (!s)
        return out;
    for (const part of s.split('&')) {
        const [rawK, rawV = ''] = part.split('=');
        const k = decodeURIComponent(rawK || '');
        const v = decodeURIComponent(rawV || '');
        if (k in out) {
            const cur = out[k];
            if (Array.isArray(cur))
                cur.push(v);
            else
                out[k] = [cur, v];
        }
        else {
            out[k] = v;
        }
    }
    return out;
}
/**
 * Ensure the value is an array. If null/undefined return empty array.
 */
function ensureArray(value) {
    if (value == null)
        return [];
    return Array.isArray(value) ? value : [value];
}
/**
 * Capitalize the first character of the string. Returns empty string as-is.
 */
function capitalize(s) {
    if (!s)
        return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}
/**
 * Simple null/undefined check.
 */
function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
//# sourceMappingURL=miscellaneousUtils.js.map