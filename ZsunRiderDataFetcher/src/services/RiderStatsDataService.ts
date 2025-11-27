import { throwValidationError, getErrorMessage, toError } from "../utils/ErrorUtils";
import { fetchTextFileFromUrl, throwIfNoConnection } from "../utils/HttpUtils";
import { RiderStatsDto } from "../models/RiderStatsDto";
import { RiderStatsItem } from "../models/RiderStatsItem";

const invalidFileFormat = "invalid_file_format";
const methodName = "fetchRiderStatsItemsFromUrl";


export function fetchRiderStatsItemsFromUrl(
    url: string): RiderStatsItem[] {

    throwIfNoConnection();
    const text = fetchTextFileFromUrl(url);

// ReSharper disable once AssignedValueIsNeverUsed
    let jsonArray: Record<string, any>[] = [];

    try {
        jsonArray = JSON.parse(text);
        if (!Array.isArray(jsonArray)) {
            throw new Error("JSON is not an array.");
        }
    } catch (err1) {
        throwValidationError(
            invalidFileFormat,
            `File content is not a valid JSON array. ${getErrorMessage(err1)}`,
            methodName,
            url,
            { exception: toError(err1) }
        );
        return []; // Ensure function does not continue
    }

    let dtoArray: RiderStatsDto[];
    try {
        dtoArray = RiderStatsDto.fromJsonArray(jsonArray);
    } catch (err2) {
        throwValidationError(
            invalidFileFormat,
            `Failed to convert JSON array to RiderStatsDto array. ${getErrorMessage(err2)}`,
            methodName,
            url,
            { exception: toError(err2) }
        );
        return []; // Ensure function does not continue
    }

    let answer: RiderStatsItem[];
    try {
        answer = RiderStatsItem.fromDtoArray(dtoArray);
    } catch (err3) {
        throwValidationError(
           invalidFileFormat,
            `Failed to map RiderStatsDto array to RiderStatsItem array. ${getErrorMessage(err3)}`,
            methodName,
            url,
            { exception: toError(err3) }
        );
        return []; // Ensure function does not continue
    }

    return answer;
}