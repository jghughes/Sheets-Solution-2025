"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRiderStatsItemsFromUrl = fetchRiderStatsItemsFromUrl;
const ErrorUtils = require("../utils/ErrorUtils");
const HttpUtils_1 = require("../utils/HttpUtils");
const RiderStatsDto_1 = require("../models/RiderStatsDto");
const RiderStatsItem_1 = require("../models/RiderStatsItem");
const invalidFileFormat = "invalid_file_format";
const methodName = "fetchRiderStatsItemsFromUrl";
function fetchRiderStatsItemsFromUrl(url) {
    (0, HttpUtils_1.throwIfNoConnection)();
    const text = (0, HttpUtils_1.fetchTextFileFromUrl)(url);
    let jsonArray = [];
    try {
        jsonArray = JSON.parse(text);
        if (!Array.isArray(jsonArray)) {
            throw new Error("JSON is not an array.");
        }
    }
    catch (err) {
        ErrorUtils.throwValidationError(invalidFileFormat, `File content is not a valid JSON array. ${ErrorUtils.getErrorMessage(err)}`, methodName, url, { exception: ErrorUtils.toError(err) });
        return []; // Ensure function does not continue
    }
    let dtoArray;
    try {
        dtoArray = RiderStatsDto_1.RiderStatsDto.fromJsonArray(jsonArray);
    }
    catch (err) {
        ErrorUtils.throwValidationError(invalidFileFormat, `Failed to convert JSON array to RiderStatsDto array. ${ErrorUtils.getErrorMessage(err)}`, methodName, url, { exception: ErrorUtils.toError(err) });
        return []; // Ensure function does not continue
    }
    let answer;
    try {
        answer = RiderStatsItem_1.RiderStatsItem.fromDtoArray(dtoArray);
    }
    catch (err) {
        ErrorUtils.throwValidationError(invalidFileFormat, `Failed to map RiderStatsDto array to RiderStatsItem array. ${ErrorUtils.getErrorMessage(err)}`, methodName, url, { exception: ErrorUtils.toError(err) });
        return []; // Ensure function does not continue
    }
    return answer;
}
