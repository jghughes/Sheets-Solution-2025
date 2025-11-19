"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../../src/utils/Logger");
describe("logEvent", () => {
    let originalConsoleLog;
    beforeEach(() => {
        originalConsoleLog = console.log;
        console.log = jest.fn();
    });
    afterEach(() => {
        console.log = originalConsoleLog;
    });
    it("logs a simple info message", () => {
        (0, Logger_1.logEvent)({ message: "Test info", level: Logger_1.LogLevel.INFO });
        expect(console.log).toHaveBeenCalled();
        const logArg = console.log.mock.calls[0][0];
        const logEntry = JSON.parse(logArg);
        expect(logEntry.message).toBe("Test info");
        expect(logEntry.level).toBe(Logger_1.LogLevel.INFO);
        expect(typeof logEntry.timestamp).toBe("string");
    });
    it("logs an error with a standard Error object", () => {
        const error = new Error("Something went wrong");
        (0, Logger_1.logEvent)({ message: "Test error", level: Logger_1.LogLevel.ERROR, exception: error });
        expect(console.log).toHaveBeenCalled();
        const logArg = console.log.mock.calls[0][0];
        const logEntry = JSON.parse(logArg);
        expect(logEntry.message).toBe("Test error");
        expect(logEntry.level).toBe(Logger_1.LogLevel.ERROR);
        expect(logEntry.exception).toMatchObject({
            name: "Error",
            message: "Something went wrong",
            stack: expect.any(String)
        });
    });
    it("logs an error with a custom toJson method and flattens context", () => {
        const customError = {
            toJson: () => ({
                name: "CustomError",
                code: "custom_code",
                message: "Custom error occurred",
                stack: "custom stack",
                context: { op: "test", detail: 42 }
            })
        };
        (0, Logger_1.logEvent)({ message: "Test custom error", level: Logger_1.LogLevel.ERROR, exception: customError });
        expect(console.log).toHaveBeenCalled();
        const logArg = console.log.mock.calls[0][0];
        const logEntry = JSON.parse(logArg);
        expect(logEntry.name).toBe("CustomError");
        expect(logEntry.code).toBe("custom_code");
        expect(logEntry.errorMessage).toBe("Custom error occurred");
        expect(logEntry.stack).toBe("custom stack");
        expect(logEntry.op).toBe("test");
        expect(logEntry.detail).toBe(42);
    });
    it("logs extraFields merged into log entry", () => {
        (0, Logger_1.logEvent)({
            message: "Test with extra fields",
            level: Logger_1.LogLevel.DEBUG,
            extraFields: { userId: 123, action: "testAction" }
        });
        expect(console.log).toHaveBeenCalled();
        const logArg = console.log.mock.calls[0][0];
        const logEntry = JSON.parse(logArg);
        expect(logEntry.userId).toBe(123);
        expect(logEntry.action).toBe("testAction");
    });
});
//# sourceMappingURL=logEvent.test.js.map