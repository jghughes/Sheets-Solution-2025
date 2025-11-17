"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseType = exports.JsonSerializer = void 0;
exports.parseField = parseField;
exports.getJsonFieldValueByFieldAliases = getJsonFieldValueByFieldAliases;
exports.parseAsString = parseAsString;
exports.parseAsFloat = parseAsFloat;
exports.parseAsInt = parseAsInt;
exports.parseAsBoolean = parseAsBoolean;
exports.fromDotNetTicks = fromDotNetTicks;
exports.numericToDate = numericToDate;
exports.parseAsDate = parseAsDate;
const class_transformer_1 = require("class-transformer");
const ErrorUtils_1 = require("./ErrorUtils");
/**
 * Utility class for serializing and deserializing DTOs using class-transformer.
 * Handles single instances, arrays, tuples, and dictionary-like objects.
 * Throws structured errors with context for easier debugging.
 */
class JsonSerializer {
    /**
     * Serializes an input model to a JSON string.
     * Throws ValidationError or ServerError on failure.
     */
    static serialize(inputModel) {
        try {
            if (inputModel === null || inputModel === undefined) {
                (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.emptyInput, "Input model is null or undefined.", "JsonSerializer.serialize", "serialize", { inputModel });
            }
            const plainObj = (0, class_transformer_1.instanceToPlain)(inputModel, {
                exposeUnsetFields: true,
                strategy: "exposeAll",
                enableCircularCheck: true,
                excludeExtraneousValues: false
            });
            return JSON.stringify(plainObj);
        }
        catch (err) {
            const inputType = inputModel && inputModel.constructor
                ? inputModel.constructor.name
                : typeof inputModel;
            const message = err.message;
            if ((0, ErrorUtils_1.isValidationError)(err))
                throw err;
            (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `Serialization failed for type <${inputType}>: ${message}`, "JsonSerializer.serialize", "serialize", { inputModel });
        }
        // Defensive: should never be reached, but satisfies TypeScript
        throw new Error("Unreachable code in JsonSerializer.serialize");
    }
    /**
     * Deserializes a JSON string to an instance, array, or dictionary of type T.
     * Throws ValidationError or ServerError on failure.
     */
    static deserialize(inputJson, cls) {
        try {
            if (typeof inputJson !== "string" || inputJson.trim() === "") {
                (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.emptyInput, "Input JSON string is empty or not a string.", "JsonSerializer.deserialize", "deserialize", { inputJson });
            }
            const plainObj = JSON.parse(inputJson);
            if (Array.isArray(plainObj)) {
                return (0, class_transformer_1.plainToInstance)(cls, plainObj);
            }
            else if (isDictionaryOfObjects(plainObj)) {
                const result = {};
                for (const key of Object.keys(plainObj)) {
                    result[key] = (0, class_transformer_1.plainToInstance)(cls, plainObj[key]);
                }
                return result;
            }
            else if (plainObj && typeof plainObj === "object") {
                return (0, class_transformer_1.plainToInstance)(cls, plainObj);
            }
            else {
                (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.invalidFileFormat, "Input JSON is not a valid object, array, or dictionary.", "JsonSerializer.deserialize", "deserialize", { inputJson });
            }
        }
        catch (err) {
            const inputType = cls && cls.name ? cls.name : "unknown";
            const message = err.message;
            if ((0, ErrorUtils_1.isValidationError)(err))
                throw err;
            (0, ErrorUtils_1.throwServerErrorWithContext)(ErrorUtils_1.serverErrorCode.unexpectedError, `Deserialization failed for type <${inputType}>: ${message}`, "JsonSerializer.deserialize", "deserialize", { inputJson });
        }
        // Defensive: should never be reached, but satisfies TypeScript
        throw new Error("Unreachable code in JsonSerializer.deserialize");
    }
}
exports.JsonSerializer = JsonSerializer;
/**
 * Helper to check if an object is a dictionary of objects (not arrays).
 * Returns false for null, non-objects, or arrays.
 */
function isDictionaryOfObjects(obj) {
    if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
        return false;
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (typeof value !== 'object' ||
                value === null ||
                Array.isArray(value)) {
                return false;
            }
        }
    }
    return true;
}
exports.parseType = {
    stringType: "string",
    floatType: "float",
    intType: "int",
    booleanType: "boolean",
    dateType: "date"
};
/**
 * Parses a field from a JSON object using an array of possible field aliases.
 * Throws ValidationError if input is invalid.
 */
function parseField(rawJson, fieldAliases, type, defaultValue) {
    if (!rawJson || typeof rawJson !== "object") {
        (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.malformedJson, "rawJson is not a valid object.", "parseField", "parseField", { rawJson });
    }
    const valueToParse = getJsonFieldValueByFieldAliases(rawJson, fieldAliases, defaultValue);
    if (type === exports.parseType.stringType)
        return parseAsString(valueToParse, defaultValue);
    if (type === exports.parseType.floatType)
        return parseAsFloat(valueToParse, defaultValue);
    if (type === exports.parseType.intType)
        return parseAsInt(valueToParse, defaultValue);
    if (type === exports.parseType.booleanType)
        return parseAsBoolean(valueToParse, defaultValue);
    if (type === exports.parseType.dateType)
        return parseAsDate(valueToParse, defaultValue);
    // Unknown type, return null
    return null;
}
/**
 * Safely retrieves a value from a JSON object using one or more possible
 * field aliases for the underlying property.
 * Throws ValidationError if input is invalid.
 */
function getJsonFieldValueByFieldAliases(rawJson, fieldAliases, defaultValue) {
    if (!rawJson || typeof rawJson !== "object") {
        (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.malformedJson, "rawJson is not a valid object.", "getJsonFieldValueByFieldAliases", "getJsonFieldValueByFieldAliases", { rawJson });
    }
    for (let i = 0; i < fieldAliases.length; i++) {
        const k = fieldAliases[i];
        if (Object.prototype.hasOwnProperty.call(rawJson, k)) {
            const v = rawJson[k];
            if (v !== "" && v !== null && v !== undefined)
                return v;
        }
    }
    return defaultValue;
}
/**
 * Parses a value as a string, returning defaultValue if invalid.
 */
function parseAsString(value, defaultValue) {
    if (typeof value !== "string") {
        return typeof defaultValue === "string" ? defaultValue : "";
    }
    const trimmed = value.trim();
    return trimmed !== "" ? trimmed : (typeof defaultValue === "string" ? defaultValue : "");
}
/**
 * Parses a value as a float, returning defaultValue if invalid.
 */
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
/**
 * Parses a value as an integer, returning defaultValue if invalid.
 */
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
/**
 * Parses a value as a boolean, returning defaultValue if invalid.
 */
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
/**
 * Converts .NET ticks to a JavaScript Date.
 * Returns Date(0) if input is invalid.
 */
function fromDotNetTicks(ticks) {
    const dotnetTicksAtUnixEpoch = 621355968000000000;
    const num = typeof ticks === "string" ? Number(ticks) : ticks;
    if (!Number.isFinite(num))
        return new Date(0);
    const ms = Math.floor((num - dotnetTicksAtUnixEpoch) / 10000);
    return new Date(ms);
}
/**
 * Converts a numeric value to a JavaScript Date.
 * Handles Unix timestamps, .NET ticks, and milliseconds.
 * Returns Date(0) if input is invalid.
 */
function numericToDate(n) {
    if (!Number.isFinite(n)) {
        (0, ErrorUtils_1.throwValidationError)(ErrorUtils_1.validationErrorCode.invalidDate, "Input is not a finite number.", "numericToDate", "numericToDate", { n });
    }
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
 * Parses a value as a Date, returning defaultValue if invalid.
 */
function parseAsDate(value, defaultValue) {
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
//# sourceMappingURL=JghSerialisation.js.map