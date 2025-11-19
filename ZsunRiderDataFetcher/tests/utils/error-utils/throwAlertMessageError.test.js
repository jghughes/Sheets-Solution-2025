"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorUtils_1 = require("../../../src/utils/ErrorUtils");
describe('throwAlertMessageError', () => {
    it('throws AlertMessageError with code and message', () => {
        const code = 'TEST_CODE';
        const message = 'Test error message';
        try {
            (0, ErrorUtils_1.throwAlertMessageError)(code, message);
        }
        catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect(err.name).toBe('AlertMessageError');
                expect(err.code).toBe(code);
                expect(err.message).toBe(message);
                expect(err.context.errorCode).toBe(code);
                expect(err.context.operationName).toBeUndefined();
                expect(err.context.callsite).toBeUndefined();
                expect(err.context.details).toBeUndefined();
            }
            else {
                throw err;
            }
        }
    });
    it('throws AlertMessageError with all context properties', () => {
        const code = 'FULL_CONTEXT_CODE';
        const message = 'Full context error';
        const operationName = 'TestOperation';
        const callsite = 'TestCallsite';
        const details = { info: 'extra details' };
        try {
            (0, ErrorUtils_1.throwAlertMessageError)(code, message, operationName, callsite, details);
        }
        catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect(err.name).toBe('AlertMessageError');
                expect(err.code).toBe(code);
                expect(err.message).toBe(message);
                expect(err.context.errorCode).toBe(code);
                expect(err.context.operationName).toBe(operationName);
                expect(err.context.callsite).toBe(callsite);
                expect(err.context.details).toEqual(details);
            }
            else {
                throw err;
            }
        }
    });
    it('throws AlertMessageError with some context properties', () => {
        const code = 'PARTIAL_CONTEXT_CODE';
        const message = 'Partial context error';
        const operationName = 'PartialOperation';
        try {
            (0, ErrorUtils_1.throwAlertMessageError)(code, message, operationName);
        }
        catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect(err.name).toBe('AlertMessageError');
                expect(err.code).toBe(code);
                expect(err.message).toBe(message);
                expect(err.context.errorCode).toBe(code);
                expect(err.context.operationName).toBe(operationName);
                expect(err.context.callsite).toBeUndefined();
                expect(err.context.details).toBeUndefined();
            }
            else {
                throw err;
            }
        }
    });
    it('throws AlertMessageError with undefined details', () => {
        const code = 'UNDEFINED_DETAILS_CODE';
        const message = 'Undefined details error';
        const operationName = 'UndefinedDetailsOperation';
        const callsite = 'UndefinedDetailsCallsite';
        try {
            (0, ErrorUtils_1.throwAlertMessageError)(code, message, operationName, callsite);
        }
        catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect(err.name).toBe('AlertMessageError');
                expect(err.code).toBe(code);
                expect(err.message).toBe(message);
                expect(err.context.errorCode).toBe(code);
                expect(err.context.operationName).toBe(operationName);
                expect(err.context.callsite).toBe(callsite);
                expect(err.context.details).toBeUndefined();
            }
            else {
                throw err;
            }
        }
    });
});
//# sourceMappingURL=throwAlertMessageError.test.js.map