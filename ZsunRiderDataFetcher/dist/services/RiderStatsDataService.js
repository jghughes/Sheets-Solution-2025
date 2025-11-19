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
exports.fetchRiderStatsItemsFromUrl = fetchRiderStatsItemsFromUrl;
const ErrorUtils = __importStar(require("../utils/ErrorUtils"));
const HttpUtils_1 = require("../utils/HttpUtils");
const RiderStatsDto_1 = require("../models/RiderStatsDto");
const RiderStatsItem_1 = require("../models/RiderStatsItem");
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
        ErrorUtils.throwValidationError(ErrorUtils.validationErrorCode.invalidFileFormat, "File content is not a valid JSON array.", "fetchFromUrlJsonArrayOfRiderStatsDtoAndMapToArrayOfRiderStatsItem", url);
        return []; // Ensure function does not continue
    }
    let dtoArray;
    try {
        dtoArray = RiderStatsDto_1.RiderStatsDto.fromJsonArray(jsonArray);
    }
    catch (err) {
        ErrorUtils.throwValidationError(ErrorUtils.validationErrorCode.invalidFileFormat, "Failed to convert JSON array to RiderStatsDto array.", "fetchRiderStatsItemsFromUrl", url);
        return []; // Ensure function does not continue
    }
    let answer;
    try {
        answer = RiderStatsItem_1.RiderStatsItem.fromDtoArray(dtoArray);
    }
    catch (err) {
        ErrorUtils.throwValidationError(ErrorUtils.validationErrorCode.invalidFileFormat, "Failed to map RiderStatsDto array to RiderStatsItem array.", "fetchRiderStatsItemsFromUrl", url);
        return []; // Ensure function does not continue
    }
    return answer;
}
//# sourceMappingURL=RiderStatsDataService.js.map