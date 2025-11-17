import * as ErrorUtils from "../utils/ErrorUtils";
import * as FileUtils from "../utils/FileUtils";
import { RiderStatsDto as RiderStatsDto } from "../models/RiderStatsDto";
import { RiderStatsItem as RiderStatsItem } from "../models/RiderStatsItem";

export function fetchRiderStatsItemsFromUrl(
    url: string): RiderStatsItem[] {

    FileUtils.throwIfNoConnection();
    const text = FileUtils.readFileFromUrl(url);

    // Parse the JSON text to an array of objects
    let jsonArray: Record<string, any>[] = [];
    try {
        jsonArray = JSON.parse(text);
        if (!Array.isArray(jsonArray)) {
            throw new Error("JSON is not an array.");
        }
    } catch (err) {
        ErrorUtils.throwValidationError(
            ErrorUtils.validationErrorCode.invalidFileFormat,
            "File content is not a valid JSON array.",
            "fetchFromUrlJsonArrayOfRiderStatsDtoAndMapToArrayOfRiderStatsItem",
            url
        );
        return []; // Ensure function does not continue
    }

    // Improved error handling for DTO conversion
    let dtoArray: RiderStatsDto[];
    try {
        dtoArray = RiderStatsDto.fromJsonArray(jsonArray);
    } catch (err) {
        ErrorUtils.throwValidationError(
            ErrorUtils.validationErrorCode.invalidFileFormat,
            "Failed to convert JSON array to RiderStatsDto array.",
            "fetchRiderStatsItemsFromUrl",
            url
        );
        return []; // Ensure function does not continue
    }

    // Improved error handling for mapping to RiderStatsItem
    let answer: RiderStatsItem[];
    try {
        answer = RiderStatsItem.fromDtoArray(dtoArray);
    } catch (err) {
        ErrorUtils.throwValidationError(
            ErrorUtils.validationErrorCode.invalidFileFormat,
            "Failed to map RiderStatsDto array to RiderStatsItem array.",
            "fetchRiderStatsItemsFromUrl",
            url
        );
        return []; // Ensure function does not continue
    }

    return answer;
}