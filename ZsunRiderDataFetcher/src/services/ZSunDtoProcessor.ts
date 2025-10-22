import * as ErrorUtils from "../utils/ErrorUtils";
import * as FileUtils from "../utils/FileUtils";
import { JsonSerializer } from "../utils/SerialisationUtils";
import { isDictionaryOfObjects, isEmptyDictionary, dictionaryToArray } from "../utils/MiscellaneousUtils";
import { ZSunDto } from "../models/ZSunDTO";
import { ZSunItem } from "../models/ZSunItem";

export function loadJsonDictOfZSunDtoFromMyDrive(
    filename: string,
    driveAppImpl?: any
) {
    FileUtils.throwIfNoConnection();
    const text = FileUtils.readFileFromMyDrive(filename, "MyDriveFetch", driveAppImpl);
    processJsonDictOfZSunDtoAndWriteSheets(text, filename);
}

export function loadJsonDictOfZSunDtoFromGoogleDrive(
    fileId: string,
    driveAppImpl?: any
) {
    FileUtils.throwIfNoConnection();
    const text = FileUtils.readFileFromGoogleDrive(fileId, "GoogleDriveFetch", driveAppImpl);
    processJsonDictOfZSunDtoAndWriteSheets(text, fileId);
}

export function loadJsonDictOfZSunDtoFromUrl(
    url: string,
    fetchImpl?: any
) {
    FileUtils.throwIfNoConnection();
    const text = FileUtils.readFileFromUrl(url, "HttpFetch", fetchImpl);
    processJsonDictOfZSunDtoAndWriteSheets(text, url);
}

export function processJsonDictOfZSunDtoAndWriteSheets(
    jsonText: string,
    sourceLabel: string
): void {

    // Deserialize JSON to dictionary
    const dict = JsonSerializer.deserialize(jsonText, ZSunDto) as { [key: string]: ZSunDto };


    if (!isDictionaryOfObjects(dict)) {
        ErrorUtils.throwValidationError(
            ErrorUtils.validationErrorCode.noRecordsVisible,
            `Unexpected file format. JSON is not a dictionary with string keys and object values.`,
            "processJsonDictOfZSunDtoAndWriteSheets",
            sourceLabel);
    }

    if (isEmptyDictionary(dict)) {
        ErrorUtils.throwValidationError(
            ErrorUtils.validationErrorCode.noRecordsVisible,
            `No entries found in JSON dictioanary.`,
            "processJsonDictOfZSunDtoAndWriteSheets",
            sourceLabel);
    }

    const arrayOfZSunDto = dictionaryToArray(dict);

    const arrayOfZSunItems = arrayOfZSunDto.map(dto => ZSunItem.fromDataTransferObject(dto));

     //writeSourceSheet(sourceRiders, "Source");

    // const normalizedRiders = dictionaryToNormalisedArray(dict);
    // if (!normalizedRiders || normalizedRiders.length === 0) {
    //     throw new ValidationError("no_normalised_riders", "No normalised rider items could be produced from JSON");
    // }
    // writeNormalisedSheet(normalizedRiders, "Normalised");

    // const precomputedRiders = dictionaryToPrecomputedArray(normalizedRiders);
    // writePrecomputedSheet(precomputedRiders, "Precomputed");

    // No return value
}