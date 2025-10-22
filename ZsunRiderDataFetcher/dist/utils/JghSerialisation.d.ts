/**
 * Utility class for serializing and deserializing DTOs using class-transformer.
 * Handles single instances, arrays, tuples, and dictionary-like objects.
 * Throws structured errors with context for easier debugging.
 */
export declare class JsonSerializer {
    /**
     * Serializes an input model to a JSON string.
     * Throws ValidationError or ServerError on failure.
     */
    static serialize<T>(inputModel: T): string;
    /**
     * Deserializes a JSON string to an instance, array, or dictionary of type T.
     * Throws ValidationError or ServerError on failure.
     */
    static deserialize<T>(inputJson: string, cls: {
        new (): T;
    }): T | T[] | {
        [key: string]: T;
    };
}
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
 * Throws ValidationError if input is invalid.
 */
export declare function parseField(rawJson: string, fieldAliases: string[], type: string, defaultValue: string | number | boolean | Date): string | number | boolean | Date | null;
/**
 * Safely retrieves a value from a JSON object using one or more possible
 * field aliases for the underlying property.
 * Throws ValidationError if input is invalid.
 */
export declare function getJsonFieldValueByFieldAliases(rawJson: any, fieldAliases: string[], defaultValue: any): any;
/**
 * Parses a value as a string, returning defaultValue if invalid.
 */
export declare function parseAsString(value: any, defaultValue: string): string;
/**
 * Parses a value as a float, returning defaultValue if invalid.
 */
export declare function parseAsFloat(value: any, defaultValue: number): number;
/**
 * Parses a value as an integer, returning defaultValue if invalid.
 */
export declare function parseAsInt(value: any, defaultValue: number): number;
/**
 * Parses a value as a boolean, returning defaultValue if invalid.
 */
export declare function parseAsBoolean(value: any, defaultValue: boolean): boolean;
/**
 * Converts .NET ticks to a JavaScript Date.
 * Returns Date(0) if input is invalid.
 */
export declare function fromDotNetTicks(ticks: number | string): Date;
/**
 * Converts a numeric value to a JavaScript Date.
 * Handles Unix timestamps, .NET ticks, and milliseconds.
 * Returns Date(0) if input is invalid.
 */
export declare function numericToDate(n: number): Date;
/**
 * Parses a value as a Date, returning defaultValue if invalid.
 */
export declare function parseAsDate(value: any, defaultValue: Date): Date;
//# sourceMappingURL=JghSerialisation.d.ts.map