export type ParseType = {
    stringType: string;
    floatType: string;
    intType: string;
    booleanType: string;
    dateType: string;
};

export const parseType: ParseType = {
    stringType: "string",
    floatType: "float",
    intType: "int",
    booleanType: "boolean",
    dateType: "date"
};

/**
 * Parses a field from a JSON object using an array of possible field aliases.
 *
 * @param rawJson - The JSON object to extract the value from.
 * @param fieldAliases - An array of strings representing possible property names (aliases).
 * @param type - The expected type of the value.
 * @param defaultValue - The value to return if no valid property is found.
 * @returns The parsed value, or `defaultValue` if not found or invalid.
 */
export function parseField(
    rawJson: string,
    fieldAliases: string[],
    type: string,
    defaultValue: string | number | boolean | Date
): string | number | boolean | Date | null {
    const valueToParse = getJsonFieldValueByFieldAliases(rawJson, fieldAliases, defaultValue);

    if (type === parseType.stringType) return parseAsString(valueToParse, defaultValue as string);
    if (type === parseType.floatType) return parseAsFloat(valueToParse, defaultValue as number);
    if (type === parseType.intType) return parseAsInt(valueToParse, defaultValue as number);
    if (type === parseType.booleanType) return parseAsBoolean(valueToParse, defaultValue as boolean);
    if (type === parseType.dateType) return parseAsDate(valueToParse, defaultValue as Date);

    // Unknown type, return null
    return null;
}

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
export function getJsonFieldValueByFieldAliases(
    rawJson: any,
    fieldAliases: string[],
    defaultValue: any
): any {
    if (!rawJson || typeof rawJson !== "object") return defaultValue;

    for (let i = 0; i < fieldAliases.length; i++) {
        const k = fieldAliases[i];
        if (Object.prototype.hasOwnProperty.call(rawJson, k)) {
            const v = rawJson[k];
            if (v !== "" && v !== null && v !== undefined) return v;
        }
    }
    return defaultValue;
}

export function parseAsString(value: any, defaultValue: string): string {
    if (typeof value !== "string") {
        return typeof defaultValue === "string" ? defaultValue : "";
    }
    const trimmed = value.trim();
    return trimmed !== "" ? trimmed : (typeof defaultValue === "string" ? defaultValue : "");
}

export function parseAsFloat(value: any, defaultValue: number): number {
    if (typeof value === "object" || typeof value === "boolean") {
        return typeof defaultValue === "number" ? defaultValue : 0.0;
    }
    if (value === "") {
        return typeof defaultValue === "number" ? defaultValue : 0.0;
    }
    const num = Number(value);
    return Number.isFinite(num) ? num : (typeof defaultValue === "number" ? defaultValue : 0.0);
}

export function parseAsInt(value: any, defaultValue: number): number {
    if (typeof value === "object" || typeof value === "boolean") {
        return typeof defaultValue === "number" ? defaultValue : 0;
    }
    if (value === "") {
        return typeof defaultValue === "number" ? defaultValue : 0;
    }
    const parsed = parseInt(value as string, 10);
    return Number.isFinite(parsed) ? parsed : (typeof defaultValue === "number" ? defaultValue : 0);
}

export function parseAsBoolean(value: any, defaultValue: boolean): boolean {
    if (typeof value === "string") {
        const str = value.trim().toLowerCase();
        if (str === "") return typeof defaultValue === "boolean" ? defaultValue : false;
        switch (str) {
            case "true":
            case "1":
            case "yes":
            case "y":
            case "on":
                return true;
            case "false":
            case "0":
            case "no":
            case "n":
            case "off":
                return false;
            default:
                if (/^-?\d+$/.test(str)) return Number(str) !== 0;
                return typeof defaultValue === "boolean" ? defaultValue : false;
        }
    }
    return typeof defaultValue === "boolean" ? defaultValue : false;
}

export function fromDotNetTicks(ticks: number | string): Date {
    const dotnetTicksAtUnixEpoch = 621355968000000000;
    const num = typeof ticks === "string" ? Number(ticks) : ticks;
    if (!Number.isFinite(num)) return new Date(0);
    const ms = Math.floor((num - dotnetTicksAtUnixEpoch) / 10000);
    return new Date(ms);
}

export function numericToDate(n: number): Date {
    if (!Number.isFinite(n)) return new Date(0);
    const abs = Math.abs(n);

    if (abs > 1e14) {
        return fromDotNetTicks(n);
    }

    if (abs < 1e11) {
        return new Date(Math.floor(n * 1000));
    }

    return new Date(Math.floor(n));
}

export function parseAsDate(value: any, defaultValue: Date): Date {
    if (!defaultValue || !(defaultValue instanceof Date)) {
        defaultValue = new Date(0);
    }

    const trimmed = typeof value === "string" ? value.trim() : "";
    if (trimmed === "") {
        return defaultValue;
    }

    // .NET /Date(xxx)/ format
    const msWrapperMatch = /^\/Date\((-?\d+)(?:[+-]\d{4})?\)\/$/.exec(trimmed);
    if (msWrapperMatch) {
        const dateObj = numericToDate(Number(msWrapperMatch[1]));
        return !isNaN(dateObj.getTime()) ? dateObj : defaultValue;
    }

    // Numeric timestamp
    if (/^-?\d+$/.test(trimmed)) {
        const dateObj = numericToDate(Number(trimmed));
        return !isNaN(dateObj.getTime()) ? dateObj : defaultValue;
    }

    // ISO 8601 format
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?(?:Z|[+-]\d{2}:\d{2}|[+-]\d{4})?$/;
    if (iso8601Regex.test(trimmed)) {
        const normalized = trimmed.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
        const dateObj = new Date(normalized);
        if (!isNaN(dateObj.getTime())) {
            return dateObj;
        }
        const parsed = Date.parse(trimmed);
        if (!isNaN(parsed)) {
            return new Date(parsed);
        }
        return defaultValue;
    }

    // Fallback: try Date.parse
    const parsedFallback = Date.parse(trimmed);
    if (!isNaN(parsedFallback)) {
        return new Date(parsedFallback);
    }

    return defaultValue;
}