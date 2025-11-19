import * as ErrorUtils from "../utils/ErrorUtils";
import { fetchTextFileFromUrl, throwIfNoConnection } from "../utils/HttpUtils";
import { RiderStatsDto as RiderStatsDto } from "../models/RiderStatsDto";
import { RiderStatsItem as RiderStatsItem } from "../models/RiderStatsItem";

export function fetchRiderStatsItemsFromUrl(
    url: string): RiderStatsItem[] {

    throwIfNoConnection();
    const text = fetchTextFileFromUrl(url);

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