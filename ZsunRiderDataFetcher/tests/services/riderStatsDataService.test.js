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
const FileUtils = __importStar(require("../../src/utils/HttpFileUtils"));
const ErrorUtils = __importStar(require("../../src/utils/ErrorUtils"));
const RiderStatsDataService_1 = require("../../src/services/RiderStatsDataService");
const RiderStatsDto_1 = require("../../src/models/RiderStatsDto");
const RiderStatsItem_1 = require("../../src/models/RiderStatsItem");
jest.mock("../../src/utils/HttpFileUtils");
jest.mock("../../src/models/RiderStatsDto");
jest.mock("../../src/models/RiderStatsItem");
jest.mock("../../src/utils/ErrorUtils");
describe("fetchRiderStatsItemsFromUrl", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("returns RiderStatsItem[] for valid JSON array", () => {
        const mockJsonArray = [{ zwiftId: "1", fullName: "A" }, { zwiftId: "2", fullName: "B" }];
        FileUtils.throwIfNoConnection.mockImplementation(() => { });
        FileUtils.fetchTextFileFromUrl.mockReturnValue(JSON.stringify(mockJsonArray));
        RiderStatsDto_1.RiderStatsDto.fromJsonArray.mockReturnValue(mockJsonArray);
        RiderStatsItem_1.RiderStatsItem.fromDtoArray.mockReturnValue(["itemA", "itemB"]);
        const result = (0, RiderStatsDataService_1.fetchRiderStatsItemsFromUrl)("https://example.com/riders.json");
        expect(result).toEqual(["itemA", "itemB"]);
        expect(FileUtils.throwIfNoConnection).toHaveBeenCalled();
        expect(FileUtils.fetchTextFileFromUrl).toHaveBeenCalledWith("https://example.com/riders.json");
        expect(RiderStatsDto_1.RiderStatsDto.fromJsonArray).toHaveBeenCalledWith(mockJsonArray);
        expect(RiderStatsItem_1.RiderStatsItem.fromDtoArray).toHaveBeenCalledWith(mockJsonArray);
    });
    it("throws validation error for invalid JSON", () => {
        FileUtils.throwIfNoConnection.mockImplementation(() => { });
        FileUtils.fetchTextFileFromUrl.mockReturnValue("not a json");
        const throwValidationErrorSpy = jest.spyOn(ErrorUtils, "throwValidationError").mockImplementation(() => { throw new Error("validation error"); });
        expect(() => (0, RiderStatsDataService_1.fetchRiderStatsItemsFromUrl)("https://example.com/invalid.json")).toThrow("validation error");
        expect(throwValidationErrorSpy).toHaveBeenCalledWith(ErrorUtils.validationErrorCode.invalidFileFormat, "File content is not a valid JSON array.", "fetchFromUrlJsonArrayOfRiderStatsDtoAndMapToArrayOfRiderStatsItem", "https://example.com/invalid.json");
    });
    it("throws validation error if JSON is not an array", () => {
        FileUtils.throwIfNoConnection.mockImplementation(() => { });
        FileUtils.fetchTextFileFromUrl.mockReturnValue(JSON.stringify({ zwiftId: "1" }));
        const throwValidationErrorSpy = jest.spyOn(ErrorUtils, "throwValidationError").mockImplementation(() => { throw new Error("validation error"); });
        expect(() => (0, RiderStatsDataService_1.fetchRiderStatsItemsFromUrl)("https://example.com/notarray.json")).toThrow("validation error");
        expect(throwValidationErrorSpy).toHaveBeenCalledWith(ErrorUtils.validationErrorCode.invalidFileFormat, "File content is not a valid JSON array.", "fetchFromUrlJsonArrayOfRiderStatsDtoAndMapToArrayOfRiderStatsItem", "https://example.com/notarray.json");
    });
    it("throws validation error if fromJsonArray fails", () => {
        const mockJsonArray = [{ zwiftId: "1" }];
        FileUtils.throwIfNoConnection.mockImplementation(() => { });
        FileUtils.fetchTextFileFromUrl.mockReturnValue(JSON.stringify(mockJsonArray));
        RiderStatsDto_1.RiderStatsDto.fromJsonArray.mockImplementation(() => { throw new Error("dto error"); });
        const throwValidationErrorSpy = jest.spyOn(ErrorUtils, "throwValidationError").mockImplementation(() => { throw new Error("validation error"); });
        expect(() => (0, RiderStatsDataService_1.fetchRiderStatsItemsFromUrl)("https://example.com/dtoerror.json")).toThrow("validation error");
        expect(throwValidationErrorSpy).toHaveBeenCalledWith(ErrorUtils.validationErrorCode.invalidFileFormat, "Failed to convert JSON array to RiderStatsDto array.", "fetchRiderStatsItemsFromUrl", "https://example.com/dtoerror.json");
    });
    it("throws validation error if fromDtoArray fails", () => {
        const mockJsonArray = [{ zwiftId: "1" }];
        FileUtils.throwIfNoConnection.mockImplementation(() => { });
        FileUtils.fetchTextFileFromUrl.mockReturnValue(JSON.stringify(mockJsonArray));
        RiderStatsDto_1.RiderStatsDto.fromJsonArray.mockReturnValue(mockJsonArray);
        RiderStatsItem_1.RiderStatsItem.fromDtoArray.mockImplementation(() => { throw new Error("item error"); });
        const throwValidationErrorSpy = jest.spyOn(ErrorUtils, "throwValidationError").mockImplementation(() => { throw new Error("validation error"); });
        expect(() => (0, RiderStatsDataService_1.fetchRiderStatsItemsFromUrl)("https://example.com/itemerror.json")).toThrow("validation error");
        expect(throwValidationErrorSpy).toHaveBeenCalledWith(ErrorUtils.validationErrorCode.invalidFileFormat, "Failed to map RiderStatsDto array to RiderStatsItem array.", "fetchRiderStatsItemsFromUrl", "https://example.com/itemerror.json");
    });
});
//# sourceMappingURL=riderStatsDataService.test.js.map