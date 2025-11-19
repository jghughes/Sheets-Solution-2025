import * as FileUtils from "../../src/utils/HttpFileUtils";
import * as ErrorUtils from "../../src/utils/ErrorUtils";
import { fetchRiderStatsItemsFromUrl } from "../../src/services/RiderStatsDataService";
import { RiderStatsDto } from "../../src/models/RiderStatsDto";
import { RiderStatsItem } from "../../src/models/RiderStatsItem";

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
        (FileUtils.throwIfNoConnection as jest.Mock).mockImplementation(() => { });
        (FileUtils.fetchTextFileFromUrl as jest.Mock).mockReturnValue(JSON.stringify(mockJsonArray));
        (RiderStatsDto.fromJsonArray as jest.Mock).mockReturnValue(mockJsonArray);
        (RiderStatsItem.fromDtoArray as jest.Mock).mockReturnValue(["itemA", "itemB"]);

        const result = fetchRiderStatsItemsFromUrl("https://example.com/riders.json");
        expect(result).toEqual(["itemA", "itemB"]);
        expect(FileUtils.throwIfNoConnection).toHaveBeenCalled();
        expect(FileUtils.fetchTextFileFromUrl).toHaveBeenCalledWith("https://example.com/riders.json");
        expect(RiderStatsDto.fromJsonArray).toHaveBeenCalledWith(mockJsonArray);
        expect(RiderStatsItem.fromDtoArray).toHaveBeenCalledWith(mockJsonArray);
    });

    it("throws validation error for invalid JSON", () => {
        (FileUtils.throwIfNoConnection as jest.Mock).mockImplementation(() => { });
        (FileUtils.fetchTextFileFromUrl as jest.Mock).mockReturnValue("not a json");
        const throwValidationErrorSpy = jest.spyOn(ErrorUtils, "throwValidationError").mockImplementation(() => { throw new Error("validation error"); });

        expect(() => fetchRiderStatsItemsFromUrl("https://example.com/invalid.json")).toThrow("validation error");
        expect(throwValidationErrorSpy).toHaveBeenCalledWith(
            ErrorUtils.validationErrorCode.invalidFileFormat,
            "File content is not a valid JSON array.",
            "fetchFromUrlJsonArrayOfRiderStatsDtoAndMapToArrayOfRiderStatsItem",
            "https://example.com/invalid.json"
        );
    });

    it("throws validation error if JSON is not an array", () => {
        (FileUtils.throwIfNoConnection as jest.Mock).mockImplementation(() => { });
        (FileUtils.fetchTextFileFromUrl as jest.Mock).mockReturnValue(JSON.stringify({ zwiftId: "1" }));
        const throwValidationErrorSpy = jest.spyOn(ErrorUtils, "throwValidationError").mockImplementation(() => { throw new Error("validation error"); });

        expect(() => fetchRiderStatsItemsFromUrl("https://example.com/notarray.json")).toThrow("validation error");
        expect(throwValidationErrorSpy).toHaveBeenCalledWith(
            ErrorUtils.validationErrorCode.invalidFileFormat,
            "File content is not a valid JSON array.",
            "fetchFromUrlJsonArrayOfRiderStatsDtoAndMapToArrayOfRiderStatsItem",
            "https://example.com/notarray.json"
        );
    });

    it("throws validation error if fromJsonArray fails", () => {
        const mockJsonArray = [{ zwiftId: "1" }];
        (FileUtils.throwIfNoConnection as jest.Mock).mockImplementation(() => { });
        (FileUtils.fetchTextFileFromUrl as jest.Mock).mockReturnValue(JSON.stringify(mockJsonArray));
        (RiderStatsDto.fromJsonArray as jest.Mock).mockImplementation(() => { throw new Error("dto error"); });
        const throwValidationErrorSpy = jest.spyOn(ErrorUtils, "throwValidationError").mockImplementation(() => { throw new Error("validation error"); });

        expect(() => fetchRiderStatsItemsFromUrl("https://example.com/dtoerror.json")).toThrow("validation error");
        expect(throwValidationErrorSpy).toHaveBeenCalledWith(
            ErrorUtils.validationErrorCode.invalidFileFormat,
            "Failed to convert JSON array to RiderStatsDto array.",
            "fetchRiderStatsItemsFromUrl",
            "https://example.com/dtoerror.json"
        );
    });

    it("throws validation error if fromDtoArray fails", () => {
        const mockJsonArray = [{ zwiftId: "1" }];
        (FileUtils.throwIfNoConnection as jest.Mock).mockImplementation(() => { });
        (FileUtils.fetchTextFileFromUrl as jest.Mock).mockReturnValue(JSON.stringify(mockJsonArray));
        (RiderStatsDto.fromJsonArray as jest.Mock).mockReturnValue(mockJsonArray);
        (RiderStatsItem.fromDtoArray as jest.Mock).mockImplementation(() => { throw new Error("item error"); });
        const throwValidationErrorSpy = jest.spyOn(ErrorUtils, "throwValidationError").mockImplementation(() => { throw new Error("validation error"); });

        expect(() => fetchRiderStatsItemsFromUrl("https://example.com/itemerror.json")).toThrow("validation error");
        expect(throwValidationErrorSpy).toHaveBeenCalledWith(
            ErrorUtils.validationErrorCode.invalidFileFormat,
            "Failed to map RiderStatsDto array to RiderStatsItem array.",
            "fetchRiderStatsItemsFromUrl",
            "https://example.com/itemerror.json"
        );
    });
});