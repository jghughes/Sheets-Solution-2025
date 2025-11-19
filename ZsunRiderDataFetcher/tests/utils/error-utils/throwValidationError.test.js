"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorUtils_1 = require("../../../src/utils/ErrorUtils");
describe("throwValidationError", () => {
    it("should throw a ValidationError with correct code and message", () => {
        const errorCode = ErrorUtils_1.validationErrorCode.fileNotFound;
        const errorMessage = "File not found";
        try {
            (0, ErrorUtils_1.throwValidationError)(errorCode, errorMessage);
        }
        catch (err) {
            expect(err).toBeInstanceOf(ErrorUtils_1.ValidationError);
            expect(err.code).toBe(errorCode);
            expect(err.message).toBe(errorMessage);
            expect(err.context.errorCode).toBe(errorCode);
        }
    });
    it("should include operationName and nameOfFunctionThatThrew in context", () => {
        const errorCode = ErrorUtils_1.validationErrorCode.invalidFileFormat;
        const errorMessage = "Invalid file format";
        const operationName = "ImportFile";
        const nameOfFunctionThatThrew = "parseFile";
        try {
            (0, ErrorUtils_1.throwValidationError)(errorCode, errorMessage, operationName, nameOfFunctionThatThrew);
        }
        catch (err) {
            expect(err.context.operationName).toBe(operationName);
            expect(err.context.nameOfFunctionThatThrew).toBe(nameOfFunctionThatThrew);
        }
    });
    it("should include moreDetails in context if provided", () => {
        const errorCode = ErrorUtils_1.validationErrorCode.missingRequiredField;
        const errorMessage = "Missing required field";
        const moreDetails = { field: "email" };
        try {
            (0, ErrorUtils_1.throwValidationError)(errorCode, errorMessage, undefined, undefined, moreDetails);
        }
        catch (err) {
            expect(err.context.moreDetails).toEqual(moreDetails);
        }
    });
    it("should throw with all context fields populated", () => {
        const errorCode = ErrorUtils_1.validationErrorCode.duplicateEntry;
        const errorMessage = "Duplicate entry found";
        const operationName = "ValidateEntries";
        const nameOfFunctionThatThrew = "checkDuplicates";
        const moreDetails = { entryId: 123 };
        try {
            (0, ErrorUtils_1.throwValidationError)(errorCode, errorMessage, operationName, nameOfFunctionThatThrew, moreDetails);
        }
        catch (err) {
            expect(err.code).toBe(errorCode);
            expect(err.message).toBe(errorMessage);
            expect(err.context.operationName).toBe(operationName);
            expect(err.context.nameOfFunctionThatThrew).toBe(nameOfFunctionThatThrew);
            expect(err.context.moreDetails).toEqual(moreDetails);
        }
    });
});
//# sourceMappingURL=throwValidationError.test.js.map