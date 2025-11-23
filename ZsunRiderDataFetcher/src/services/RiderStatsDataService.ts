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

    let jsonArray: Record<string, any>[] = [];
    try {
        jsonArray = JSON.parse(text);
        if (!Array.isArray(jsonArray)) {
            throw new Error("JSON is not an array.");
        }
    } catch (err) {
        throwValidationError(
            invalidFileFormat,
            `File content is not a valid JSON array. ${getErrorMessage(err)}`,
            methodName,
            url,
            { exception: toError(err) }
        );
        return []; // Ensure function does not continue
    }

    let dtoArray: RiderStatsDto[];
    try {
        dtoArray = RiderStatsDto.fromJsonArray(jsonArray);
    } catch (err) {
        throwValidationError(
            invalidFileFormat,
            `Failed to convert JSON array to RiderStatsDto array. ${getErrorMessage(err)}`,
            methodName,
            url,
            { exception: toError(err) }
        );
        return []; // Ensure function does not continue
    }

    let answer: RiderStatsItem[];
    try {
        answer = RiderStatsItem.fromDtoArray(dtoArray);
    } catch (err) {
        throwValidationError(
           invalidFileFormat,
            `Failed to map RiderStatsDto array to RiderStatsItem array. ${getErrorMessage(err)}`,
            methodName,
            url,
            { exception: toError(err) }
        );
        return []; // Ensure function does not continue
    }

    return answer;
}