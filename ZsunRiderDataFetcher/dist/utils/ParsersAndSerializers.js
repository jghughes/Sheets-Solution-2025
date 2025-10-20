"use strict";
const parseType = {
    STRING: "string",
    FLOAT: "float",
    INT: "int",
    BOOLEAN: "boolean",
    DATE: "date"
};
function resolveValue(rawJson, key, defaultValue) {
    if (!rawJson || typeof rawJson !== "object")
        return defaultValue;
    if (Array.isArray(key)) {
        for (let i = 0; i < key.length; i++) {
            const k = key[i];
            if (Object.prototype.hasOwnProperty.call(rawJson, k)) {
                const v = rawJson[k];
                if (v !== "" && v !== null && v !== undefined)
                    return v;
            }
        }
        return defaultValue;
    }
    if (Object.prototype.hasOwnProperty.call(rawJson, key)) {
        const v = rawJson[key];
        if (v !== "" && v !== null && v !== undefined)
            return v;
    }
    return defaultValue;
}
function parseAsString(value, defaultValue) {
    if (typeof value !== "string") {
        return typeof defaultValue === "string" ? defaultValue : "";
    }
    const trimmed = value.trim();
    return trimmed !== "" ? trimmed : (typeof defaultValue === "string" ? defaultValue : "");
}
function parseAsFloat(value, defaultValue) {
    if (typeof value === "object" || typeof value === "boolean") {
        return typeof defaultValue === "number" ? defaultValue : 0.0;
    }
    if (value === "") {
        return typeof defaultValue === "number" ? defaultValue : 0.0;
    }
    const num = Number(value);
    return Number.isFinite(num) ? num : (typeof defaultValue === "number" ? defaultValue : 0.0);
}
function parseAsInt(value, defaultValue) {
    if (typeof value === "object" || typeof value === "boolean") {
        return typeof defaultValue === "number" ? defaultValue : 0;
    }
    if (value === "") {
        return typeof defaultValue === "number" ? defaultValue : 0;
    }
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : (typeof defaultValue === "number" ? defaultValue : 0);
}
function parseAsBoolean(value, defaultValue) {
    if (typeof value === "string") {
        const str = value.trim().toLowerCase();
        if (str === "")
            return typeof defaultValue === "boolean" ? defaultValue : false;
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
                if (/^-?\d+$/.test(str))
                    return Number(str) !== 0;
                return typeof defaultValue === "boolean" ? defaultValue : false;
        }
    }
    return typeof defaultValue === "boolean" ? defaultValue : false;
}
function fromDotNetTicks(ticks) {
    const dotnetTicksAtUnixEpoch = 621355968000000000;
    const num = typeof ticks === "string" ? Number(ticks) : ticks;
    if (!Number.isFinite(num))
        return new Date(0);
    const ms = Math.floor((num - dotnetTicksAtUnixEpoch) / 10000);
    return new Date(ms);
}
function numericToDate(n) {
    if (!Number.isFinite(n))
        return new Date(0);
    const abs = Math.abs(n);
    if (abs > 1e14) {
        return fromDotNetTicks(n);
    }
    if (abs < 1e11) {
        return new Date(Math.floor(n * 1000));
    }
    return new Date(Math.floor(n));
}
function parseAsDate(value, defaultValue) {
    if (!defaultValue || !(defaultValue instanceof Date)) {
        defaultValue = new Date(0);
    }
    const trimmed = value.trim();
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
function serializeString(value, defaultValue) {
    return parseAsString(value, defaultValue);
}
function serializeFloat(value, defaultValue) {
    if (typeof value === "number")
        return value;
    if (value === "")
        return typeof defaultValue === "number" ? defaultValue : 0;
    return parseAsFloat(value, typeof defaultValue === "number" ? defaultValue : 0);
}
function serializeInt(value, defaultValue) {
    if (typeof value === "number")
        return value;
    if (value === "")
        return typeof defaultValue === "number" ? defaultValue : 0;
    return parseAsInt(value, typeof defaultValue === "number" ? defaultValue : 0);
}
function serializeDate(value) {
    if (value instanceof Date)
        return value.toISOString();
    const parsed = parseAsDate(value, new Date(0));
    if (parsed instanceof Date)
        return parsed.toISOString();
    return typeof value === "string" ? value : "";
}
function serializeType(value, type, defaultValue) {
    if (type === parseType.STRING)
        return serializeString(value, defaultValue);
    if (type === parseType.FLOAT)
        return serializeFloat(value, defaultValue);
    if (type === parseType.INT)
        return serializeInt(value, defaultValue);
    if (type === parseType.DATE)
        return serializeDate(value);
    if (type === parseType.BOOLEAN) {
        return parseAsBoolean(value, typeof defaultValue === "boolean" ? defaultValue : false);
    }
    return "";
}
function parseField(rawJson, key, type, defaultValue) {
    const valueToParse = resolveValue(rawJson, key, defaultValue);
    if (type === parseType.STRING)
        return parseAsString(valueToParse, defaultValue);
    if (type === parseType.FLOAT)
        return parseAsFloat(valueToParse, defaultValue);
    if (type === parseType.INT)
        return parseAsInt(valueToParse, defaultValue);
    if (type === parseType.BOOLEAN)
        return parseAsBoolean(valueToParse, defaultValue);
    if (type === parseType.DATE)
        return parseAsDate(valueToParse, defaultValue);
    return "";
}
//# sourceMappingURL=ParsersAndSerializers.js.map