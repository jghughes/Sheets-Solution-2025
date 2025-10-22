import { instanceToPlain, plainToInstance } from "class-transformer";
import {
    throwValidationError,
    throwServerErrorWithContext,
    isValidationError,
    validationErrorCode,
    serverErrorCode
} from "./ErrorUtils";

import { isDictionaryOfObjects } from "./miscellaneousUtils";

/**
 * Utility class for serializing and deserializing DTOs using class-transformer.
 * Handles single instances, arrays, tuples, and dictionary-like objects.
 * Throws structured errors with context for easier debugging.
 */
export class JsonSerializer {
    /**
     * Serializes an input model to a JSON string.
     * Throws ValidationError or ServerError on failure.
     */
    static serialize<T>(inputModel: T): string {
        try {
            if (inputModel === null || inputModel === undefined) {
                throwValidationError(
                    validationErrorCode.emptyInput,
                    "Input model is null or undefined.",
                    "JsonSerializer.serialize",
                    "serialize",
                    { inputModel }
                );
            }
            const plainObj = instanceToPlain(inputModel, {
                exposeUnsetFields: true,
                strategy: "exposeAll",
                enableCircularCheck: true,
                excludeExtraneousValues: false
            });
            return JSON.stringify(plainObj);
        } catch (err) {
            const inputType = inputModel && (inputModel as any).constructor
                ? (inputModel as any).constructor.name
                : typeof inputModel;
            const message = (err as Error).message;
            if (isValidationError(err)) throw err;
            throwServerErrorWithContext(
                serverErrorCode.unexpectedError,
                `Serialization failed for type <${inputType}>: ${message}`,
                "JsonSerializer.serialize",
                "serialize",
                { inputModel }
            );
        }
        // Defensive: should never be reached, but satisfies TypeScript
        throw new Error("Unreachable code in JsonSerializer.serialize");
    }

    /**
     * Deserializes a JSON string to an instance, array, or dictionary of type T.
     * Throws ValidationError or ServerError on failure.
     */
    static deserialize<T>(inputJson: string, cls: { new(): T }): T | T[] | { [key: string]: T } {
        try {
            if (typeof inputJson !== "string" || inputJson.trim() === "") {
                throwValidationError(
                    validationErrorCode.emptyInput,
                    "Input JSON string is empty or not a string.",
                    "JsonSerializer.deserialize",
                    "deserialize",
                    { inputJson }
                );
            }
            const plainObj = JSON.parse(inputJson);

            if (Array.isArray(plainObj)) {
                return plainToInstance(cls, plainObj) as T[];
            } else if (isDictionaryOfObjects(plainObj)) {
                const result: { [key: string]: T } = {};
                for (const key of Object.keys(plainObj)) {
                    result[key] = plainToInstance(cls, (plainObj as Record<string, Record<string, any>>)[key]) as T;
                }
                return result;
            } else if (plainObj && typeof plainObj === "object") {
                return plainToInstance(cls, plainObj) as T;
            } else {
                throwValidationError(
                    validationErrorCode.invalidFileFormat,
                    "Input JSON is not a valid object, array, or dictionary.",
                    "JsonSerializer.deserialize",
                    "deserialize",
                    { inputJson }
                );
            }
        } catch (err) {
            const inputType = cls && cls.name ? cls.name : "unknown";
            const message = (err as Error).message;
            if (isValidationError(err)) throw err;
            throwServerErrorWithContext(
                serverErrorCode.unexpectedError,
                `Deserialization failed for type <${inputType}>: ${message}`,
                "JsonSerializer.deserialize",
                "deserialize",
                { inputJson }
            );
        }
        // Defensive: should never be reached, but satisfies TypeScript
        throw new Error("Unreachable code in JsonSerializer.deserialize");
    }
}


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
 * Throws ValidationError if input is invalid.
 */
export function parseField(
    rawJson: string,
    fieldAliases: string[],
    type: string,
    defaultValue: string | number | boolean | Date
): string | number | boolean | Date | null {
    if (!rawJson || typeof rawJson !== "object") {
        throwValidationError(
            validationErrorCode.malformedJson,
            "rawJson is not a valid object.",
            "parseField",
            "parseField",
            { rawJson }
        );
    }
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
 * Throws ValidationError if input is invalid.
 */
export function getJsonFieldValueByFieldAliases(
    rawJson: any,
    fieldAliases: string[],
    defaultValue: any
): any {
    if (!rawJson || typeof rawJson !== "object") {
        throwValidationError(
            validationErrorCode.malformedJson,
            "rawJson is not a valid object.",
            "getJsonFieldValueByFieldAliases",
            "getJsonFieldValueByFieldAliases",
            { rawJson }
        );
    }

    for (let i = 0; i < fieldAliases.length; i++) {
        const k = fieldAliases[i];
        if (Object.prototype.hasOwnProperty.call(rawJson, k)) {
            const v = rawJson[k];
            if (v !== "" && v !== null && v !== undefined) return v;
        }
    }
    return defaultValue;
}

/**
 * Parses a value as a string, returning defaultValue if invalid.
 */
export function parseAsString(value: any, defaultValue: string): string {
    if (typeof value !== "string") {
        return typeof defaultValue === "string" ? defaultValue : "";
    }
    const trimmed = value.trim();
    return trimmed !== "" ? trimmed : (typeof defaultValue === "string" ? defaultValue : "");
}

/**
 * Parses a value as a float, returning defaultValue if invalid.
 */
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

/**
 * Parses a value as an integer, returning defaultValue if invalid.
 */
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

/**
 * Parses a value as a boolean, returning defaultValue if invalid.
 */
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

/**
 * Converts .NET ticks to a JavaScript Date.
 * Returns Date(0) if input is invalid.
 */
export function fromDotNetTicks(ticks: number | string): Date {
    const dotnetTicksAtUnixEpoch = 621355968000000000;
    const num = typeof ticks === "string" ? Number(ticks) : ticks;
    if (!Number.isFinite(num)) return new Date(0);
    const ms = Math.floor((num - dotnetTicksAtUnixEpoch) / 10000);
    return new Date(ms);
}

/**
 * Converts a numeric value to a JavaScript Date.
 * Handles Unix timestamps, .NET ticks, and milliseconds.
 * Returns Date(0) if input is invalid.
 */
export function numericToDate(n: number): Date {
    if (!Number.isFinite(n)) {
        throwValidationError(
            validationErrorCode.invalidDate,
            "Input is not a finite number.",
            "numericToDate",
            "numericToDate",
            { n }
        );
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