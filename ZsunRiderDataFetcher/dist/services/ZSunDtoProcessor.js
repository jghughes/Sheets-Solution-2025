"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJsonDictOfZSunDtoFromMyDrive = loadJsonDictOfZSunDtoFromMyDrive;
exports.loadJsonDictOfZSunDtoFromGoogleDrive = loadJsonDictOfZSunDtoFromGoogleDrive;
exports.loadJsonDictOfZSunDtoFromUrl = loadJsonDictOfZSunDtoFromUrl;
exports.processJsonDictOfZSunDtoAndWriteSheets = processJsonDictOfZSunDtoAndWriteSheets;
const ErrorUtils = __importStar(require("../utils/ErrorUtils"));
const FileUtils = __importStar(require("../utils/FileUtils"));
const SerialisationUtils_1 = require("../utils/SerialisationUtils");
const MiscellaneousUtils_1 = require("../utils/MiscellaneousUtils");
const ZSunDTO_1 = require("../models/ZSunDTO");
const ZSunItem_1 = require("../models/ZSunItem");
function loadJsonDictOfZSunDtoFromMyDrive(filename, driveAppImpl) {
    FileUtils.throwIfNoConnection();
    const text = FileUtils.readFileFromMyDrive(filename, "MyDriveFetch", driveAppImpl);
    processJsonDictOfZSunDtoAndWriteSheets(text, filename);
}
function loadJsonDictOfZSunDtoFromGoogleDrive(fileId, driveAppImpl) {
    FileUtils.throwIfNoConnection();
    const text = FileUtils.readFileFromGoogleDrive(fileId, "GoogleDriveFetch", driveAppImpl);
    processJsonDictOfZSunDtoAndWriteSheets(text, fileId);
}
function loadJsonDictOfZSunDtoFromUrl(url, fetchImpl) {
    FileUtils.throwIfNoConnection();
    const text = FileUtils.readFileFromUrl(url, "HttpFetch", fetchImpl);
    processJsonDictOfZSunDtoAndWriteSheets(text, url);
}
function processJsonDictOfZSunDtoAndWriteSheets(jsonText, sourceLabel) {
    // Deserialize JSON to dictionary
    const dict = SerialisationUtils_1.JsonSerializer.deserialize(jsonText, ZSunDTO_1.ZSunDto);
    if (!(0, MiscellaneousUtils_1.isDictionaryOfObjects)(dict)) {
        ErrorUtils.throwValidationError(ErrorUtils.validationErrorCode.noRecordsVisible, `Unexpected file format. JSON is not a dictionary with string keys and object values.`, "processJsonDictOfZSunDtoAndWriteSheets", sourceLabel);
    }
    if ((0, MiscellaneousUtils_1.isEmptyDictionary)(dict)) {
        ErrorUtils.throwValidationError(ErrorUtils.validationErrorCode.noRecordsVisible, `No entries found in JSON dictioanary.`, "processJsonDictOfZSunDtoAndWriteSheets", sourceLabel);
    }
    const arrayOfZSunDto = (0, MiscellaneousUtils_1.dictionaryToArray)(dict);
    const arrayOfZSunItems = arrayOfZSunDto.map(dto => ZSunItem_1.ZSunItem.fromDataTransferObject(dto));
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
//# sourceMappingURL=ZSunDtoProcessor.js.map