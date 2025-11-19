import { logEvent, LogLevel } from "../../../src/utils/Logger";

describe("logEvent", () => {
    let originalConsoleLog: typeof console.log;

    beforeEach(() => {
        originalConsoleLog = console.log;
        console.log = jest.fn();
    });

    afterEach(() => {
        console.log = originalConsoleLog;
    });

    it("logs a simple info message", () => {
        logEvent({ message: "Test info", level: LogLevel.INFO });
        expect(console.log).toHaveBeenCalled();
        const logArg = (console.log as any).mock.calls[0][0];
        const logEntry = JSON.parse(logArg);
        expect(logEntry.message).toBe("Test info");
        expect(logEntry.level).toBe(LogLevel.INFO);
        expect(typeof logEntry.timestamp).toBe("string");
    });

    it("logs an error with a standard Error object", () => {
        const error = new Error("Something went wrong");
        logEvent({ message: "Test error", level: LogLevel.ERROR, exception: error });
        expect(console.log).toHaveBeenCalled();
        const logArg = (console.log as any).mock.calls[0][0];
        const logEntry = JSON.parse(logArg);
        expect(logEntry.message).toBe("Test error");
        expect(logEntry.level).toBe(LogLevel.ERROR);
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
        logEvent({ message: "Test custom error", level: LogLevel.ERROR, exception: customError as any });
        expect(console.log).toHaveBeenCalled();
        const logArg = (console.log as any).mock.calls[0][0];
        const logEntry = JSON.parse(logArg);
        expect(logEntry.name).toBe("CustomError");
        expect(logEntry.code).toBe("custom_code");
        expect(logEntry.errorMessage).toBe("Custom error occurred");
        expect(logEntry.stack).toBe("custom stack");
        expect(logEntry.op).toBe("test");
        expect(logEntry.detail).toBe(42);
    });

    it("logs extraFields merged into log entry", () => {
        logEvent({
            message: "Test with extra fields",
            level: LogLevel.DEBUG,
            extraFields: { userId: 123, action: "testAction" }
        });
        expect(console.log).toHaveBeenCalled();
        const logArg = (console.log as any).mock.calls[0][0];
        const logEntry = JSON.parse(logArg);
        expect(logEntry.userId).toBe(123);
        expect(logEntry.action).toBe("testAction");
    });
});