"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorUtils_1 = require("../../../src/utils/ErrorUtils");
describe("enrichErrorContext", () => {
    it("should add new properties to an error's context", () => {
        const error = new ErrorUtils_1.ValidationError("code", "msg", { foo: "bar" });
        const extraContext = { baz: 42 };
        (0, ErrorUtils_1.enrichErrorContext)(error, extraContext);
        expect(error.context.foo).toBe("bar");
        expect(error.context.baz).toBe(42);
    });
    it("should overwrite existing properties in context", () => {
        const error = new ErrorUtils_1.ServerError("code", "msg", { a: 1, b: 2 });
        const extraContext = { b: 99 };
        (0, ErrorUtils_1.enrichErrorContext)(error, extraContext);
        expect(error.context.a).toBe(1);
        expect(error.context.b).toBe(99);
    });
    it("should initialize context if it is undefined", () => {
        // context is undefined by default if not passed
        const error = new ErrorUtils_1.AlertMessageError("code", "msg", undefined);
        const extraContext = { x: "y" };
        (0, ErrorUtils_1.enrichErrorContext)(error, extraContext);
        expect(error.context.x).toBe("y");
    });
    it("should initialize context if it is null", () => {
        const obj = { context: null };
        const extraContext = { test: true };
        (0, ErrorUtils_1.enrichErrorContext)(obj, extraContext);
        expect(obj.context.test).toBe(true);
    });
    it("should work with plain objects that have a context property", () => {
        const obj = {};
        const extraContext = { test: true };
        (0, ErrorUtils_1.enrichErrorContext)(obj, extraContext);
        expect(obj.context.test).toBe(true);
    });
    it("should not modify context if no properties are provided", () => {
        const error = new ErrorUtils_1.ValidationError("code", "msg", { foo: "bar" });
        const extraContext = {};
        (0, ErrorUtils_1.enrichErrorContext)(error, extraContext);
        expect(error.context).toEqual({ foo: "bar" });
    });
});
//# sourceMappingURL=enrichErrorContext.test.js.map