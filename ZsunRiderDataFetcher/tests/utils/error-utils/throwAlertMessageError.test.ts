import { throwAlertMessageError } from '../../../src/utils/ErrorUtils';

describe('throwAlertMessageError', () => {
    it('throws AlertMessageError with code and message', () => {
        const code = 'TEST_CODE';
        const message = 'Test error message';

        try {
            throwAlertMessageError(code, message);
        } catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect((err as any).name).toBe('AlertMessageError');
                expect((err as any).code).toBe(code);
                expect((err as any).message).toBe(message);
                expect((err as any).context.errorCode).toBe(code);
                expect((err as any).context.operationName).toBeUndefined();
                expect((err as any).context.callsite).toBeUndefined();
                expect((err as any).context.details).toBeUndefined();
            } else {
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
            throwAlertMessageError(code, message, operationName, callsite, details);
        } catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect((err as any).name).toBe('AlertMessageError');
                expect((err as any).code).toBe(code);
                expect((err as any).message).toBe(message);
                expect((err as any).context.errorCode).toBe(code);
                expect((err as any).context.operationName).toBe(operationName);
                expect((err as any).context.callsite).toBe(callsite);
                expect((err as any).context.details).toEqual(details);
            } else {
                throw err;
            }
        }
    });

    it('throws AlertMessageError with some context properties', () => {
        const code = 'PARTIAL_CONTEXT_CODE';
        const message = 'Partial context error';
        const operationName = 'PartialOperation';

        try {
            throwAlertMessageError(code, message, operationName);
        } catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect((err as any).name).toBe('AlertMessageError');
                expect((err as any).code).toBe(code);
                expect((err as any).message).toBe(message);
                expect((err as any).context.errorCode).toBe(code);
                expect((err as any).context.operationName).toBe(operationName);
                expect((err as any).context.callsite).toBeUndefined();
                expect((err as any).context.details).toBeUndefined();
            } else {
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
            throwAlertMessageError(code, message, operationName, callsite);
        } catch (err) {
            if (err && typeof err === 'object' && 'code' in err && 'context' in err) {
                expect((err as any).name).toBe('AlertMessageError');
                expect((err as any).code).toBe(code);
                expect((err as any).message).toBe(message);
                expect((err as any).context.errorCode).toBe(code);
                expect((err as any).context.operationName).toBe(operationName);
                expect((err as any).context.callsite).toBe(callsite);
                expect((err as any).context.details).toBeUndefined();
            } else {
                throw err;
            }
        }
    });
});