import { throwServerErrorWithContext, serverErrorCode } from "../../../src/utils/ErrorUtils";

describe("throwServerErrorWithContext", () => {
    it("should throw a ServerError with correct code and message", () => {
        const errorCode = serverErrorCode.unexpectedError;
        const errorMessage = "Unexpected server error";
        try {
            throwServerErrorWithContext(errorCode, errorMessage);
        } catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect((err as any).code).toBe(errorCode);
                expect((err as any).message).toBe(errorMessage);
                expect((err as any).context.errorCode).toBe(errorCode);
            } else {
                throw err;
            }
        }
    });

    it("should include operationName and callsite in context", () => {
        const errorCode = serverErrorCode.timeout;
        const errorMessage = "Request timed out";
        const operationName = "FetchData";
        const callsite = "getDataFromServer";
        try {
            throwServerErrorWithContext(errorCode, errorMessage, operationName, callsite);
        } catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect((err as any).context.operationName).toBe(operationName);
                expect((err as any).context.callsite).toBe(callsite);
            } else {
                throw err;
            }
        }
    });

    it("should include details in context if provided", () => {
        const errorCode = serverErrorCode.serviceUnavailable;
        const errorMessage = "Service is unavailable";
        const details = { status: 503, retryAfter: 30 };
        try {
            throwServerErrorWithContext(errorCode, errorMessage, undefined, undefined, details);
        } catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect((err as any).context.details).toEqual(details);
            } else {
                throw err;
            }
        }
    });

    it("should throw with all context fields populated", () => {
        const errorCode = serverErrorCode.noInternet;
        const errorMessage = "No internet connection";
        const operationName = "SyncData";
        const callsite = "syncService";
        const details = { offline: true };
        try {
            throwServerErrorWithContext(errorCode, errorMessage, operationName, callsite, details);
        } catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect((err as any).code).toBe(errorCode);
                expect((err as any).message).toBe(errorMessage);
                expect((err as any).context.operationName).toBe(operationName);
                expect((err as any).context.callsite).toBe(callsite);
                expect((err as any).context.details).toEqual(details);
            } else {
                throw err;
            }
        }
    });
});