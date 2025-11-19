"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorUtils_1 = require("../../../src/utils/ErrorUtils");
describe("throwServerErrorWithContext", () => {
    it("should throw a ServerError with correct code and message", () => {
        const errorCode = ErrorUtils_1.serverErrorCode.unexpectedError;
        const errorMessage = "Unexpected server error";
        try {
            (0, ErrorUtils_1.throwServerErrorWithContext)(errorCode, errorMessage);
        }
        catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect(err.code).toBe(errorCode);
                expect(err.message).toBe(errorMessage);
                expect(err.context.errorCode).toBe(errorCode);
            }
            else {
                throw err;
            }
        }
    });
    it("should include operationName and callsite in context", () => {
        const errorCode = ErrorUtils_1.serverErrorCode.timeout;
        const errorMessage = "Request timed out";
        const operationName = "FetchData";
        const callsite = "getDataFromServer";
        try {
            (0, ErrorUtils_1.throwServerErrorWithContext)(errorCode, errorMessage, operationName, callsite);
        }
        catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect(err.context.operationName).toBe(operationName);
                expect(err.context.callsite).toBe(callsite);
            }
            else {
                throw err;
            }
        }
    });
    it("should include details in context if provided", () => {
        const errorCode = ErrorUtils_1.serverErrorCode.serviceUnavailable;
        const errorMessage = "Service is unavailable";
        const details = { status: 503, retryAfter: 30 };
        try {
            (0, ErrorUtils_1.throwServerErrorWithContext)(errorCode, errorMessage, undefined, undefined, details);
        }
        catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect(err.context.details).toEqual(details);
            }
            else {
                throw err;
            }
        }
    });
    it("should throw with all context fields populated", () => {
        const errorCode = ErrorUtils_1.serverErrorCode.noInternet;
        const errorMessage = "No internet connection";
        const operationName = "SyncData";
        const callsite = "syncService";
        const details = { offline: true };
        try {
            (0, ErrorUtils_1.throwServerErrorWithContext)(errorCode, errorMessage, operationName, callsite, details);
        }
        catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect(err.code).toBe(errorCode);
                expect(err.message).toBe(errorMessage);
                expect(err.context.operationName).toBe(operationName);
                expect(err.context.callsite).toBe(callsite);
                expect(err.context.details).toEqual(details);
            }
            else {
                throw err;
            }
        }
    });
});
//# sourceMappingURL=throwServerErrorWithContext.test.js.map